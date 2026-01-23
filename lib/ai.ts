import { format, isToday, formatDistanceToNow } from 'date-fns';
import { SecondBrainContext, ChatMessage } from '@/types';

const SYSTEM_PROMPT = `You are SecondBrain AI, a personal productivity assistant integrated into a dashboard app.

You have access to the user's:
- Tasks (with priorities and due dates)
- Calendar events
- Notes
- Habit tracking data
- Focus session history
- Mood logs

Your role is to:
1. Help users stay productive and focused
2. Provide actionable advice based on their data
3. Summarize and analyze their productivity patterns
4. Suggest priorities and next actions
5. Be encouraging but honest

Communication style:
- Be concise and actionable
- Use bullet points for lists
- Reference specific data when relevant
- Be warm and supportive
- Avoid generic advice - be specific to their situation

Current context:
{{CONTEXT}}`;

export function hasApiKey(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('openai-api-key');
}

export function setApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('openai-api-key', key);
  }
}

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('openai-api-key');
}

export async function chat(
  messages: ChatMessage[],
  context: SecondBrainContext
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateMockResponse(messages, context);
  }

  try {
    const systemPrompt = SYSTEM_PROMPT.replace(
      '{{CONTEXT}}',
      JSON.stringify(context, null, 2)
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateMockResponse(messages, context);
  }
}

export function generateMockResponse(
  messages: ChatMessage[],
  context: SecondBrainContext
): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  const { tasks, events, habits, focusSessions, mood, userName } = context;

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const highPriorityTasks = incompleteTasks.filter((t) => t.priority === 'high');
  const todayEvents = events.filter((e) => isToday(new Date(e.date)));
  const totalFocusToday = focusSessions
    .filter((s) => isToday(new Date(s.date)))
    .reduce((acc, s) => acc + s.duration, 0);
  const completedToday = tasks.filter(
    (t) => t.completed && t.completedAt && isToday(new Date(t.completedAt))
  ).length;

  // Greeting responses
  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
    return `Hey ${userName}! 👋 I'm here to help you stay productive. You have ${incompleteTasks.length} tasks to work on today${highPriorityTasks.length > 0 ? `, including ${highPriorityTasks.length} high-priority item${highPriorityTasks.length > 1 ? 's' : ''}` : ''}. What would you like to focus on?`;
  }

  // Focus-related queries
  if (lastMessage.includes('focus') || lastMessage.includes('should i') || lastMessage.includes('what next') || lastMessage.includes('prioritize')) {
    if (highPriorityTasks.length > 0) {
      const task = highPriorityTasks[0];
      const dueInfo = task.dueDate
        ? ` It's due ${task.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'today' : formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}.`
        : '';
      return `Based on your task list, I'd recommend focusing on **"${task.title}"** first. It's marked as high priority.${dueInfo}

After that, you have ${incompleteTasks.length - 1} other tasks waiting. Consider starting a focus session to tackle them systematically.

**Quick actions:**
- Start a 25-minute focus session
- Break down "${task.title}" into smaller steps
- Review your full task list`;
    }
    if (incompleteTasks.length > 0) {
      return `You have ${incompleteTasks.length} tasks to work on. The next one on your list is **"${incompleteTasks[0].title}"**.

Based on your patterns, you're most productive in the morning. Consider tackling your most challenging task now while your energy is high.

Would you like me to help prioritize your task list?`;
    }
    return `🎉 Amazing! You've completed all your tasks. Time to either take a well-deserved break or add some new goals to work towards.`;
  }

  // Day summary
  if (lastMessage.includes('summarize') || lastMessage.includes('summary') || lastMessage.includes('day') || lastMessage.includes('overview')) {
    const habitsDone = habits.filter((h) =>
      h.completedDates.includes(format(new Date(), 'yyyy-MM-dd'))
    ).length;
    const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);

    return `📊 **Your Day at a Glance**

**Tasks**
- ${completedToday} completed today
- ${incompleteTasks.length} remaining
${highPriorityTasks.length > 0 ? `- ⚠️ ${highPriorityTasks.length} high-priority pending` : '- ✅ No urgent tasks'}

**Focus Time**
- ${Math.round(totalFocusToday / 60)} minutes of focused work
- ${focusSessions.filter((s) => isToday(new Date(s.date))).length} sessions completed

**Habits**
- ${habitsDone}/${habits.length} habits checked off
- 🔥 Longest streak: ${maxStreak} days

**Calendar**
- ${todayEvents.length} events today
${todayEvents.length > 0 ? `- Next: ${todayEvents[0].title} at ${todayEvents[0].startTime}` : ''}

${incompleteTasks.length === 0 ? "You're crushing it today! 🎉" : 'Keep up the momentum! 💪'}`;
  }

  // Task-related queries
  if (lastMessage.includes('task') || lastMessage.includes('todo') || lastMessage.includes('to-do')) {
    const taskList = incompleteTasks.slice(0, 5).map((t, i) => {
      const priority = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
      const due = t.dueDate ? ` (due ${t.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'today' : formatDistanceToNow(new Date(t.dueDate), { addSuffix: true })})` : '';
      return `${i + 1}. ${priority} ${t.title}${due}`;
    }).join('\n');

    return `You have **${incompleteTasks.length} incomplete tasks**:

${taskList}
${incompleteTasks.length > 5 ? `\n...and ${incompleteTasks.length - 5} more` : ''}

**Suggestions:**
- Start with the high-priority items first
- Consider breaking large tasks into smaller steps
- Use focus sessions for deep work

Would you like me to help prioritize these or break any down into smaller steps?`;
  }

  // Habit queries
  if (lastMessage.includes('habit') || lastMessage.includes('streak')) {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const habitStatus = habits.map((h) => {
      const done = h.completedDates.includes(todayStr);
      return `${h.emoji} ${h.name}: ${done ? '✅' : '⬜'} (${h.currentStreak} day streak)`;
    }).join('\n');

    const longestStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
    const habitWithLongest = habits.find((h) => h.currentStreak === longestStreak);

    return `**Your Habits Today**

${habitStatus}

${habitWithLongest ? `🔥 **${habitWithLongest.name}** is your strongest habit with a ${longestStreak}-day streak!` : ''}

Keep showing up every day - consistency beats intensity!`;
  }

  // Mood queries
  if (lastMessage.includes('mood') || lastMessage.includes('feeling') || lastMessage.includes('how am i')) {
    const recentMoods = mood.slice(0, 7);
    const avgMood = recentMoods.length > 0
      ? recentMoods.reduce((acc, m) => acc + m.mood, 0) / recentMoods.length
      : 0;
    const moodEmoji = avgMood >= 4 ? '😄' : avgMood >= 3 ? '🙂' : avgMood >= 2 ? '😐' : '😕';

    return `**Your Mood Trends** ${moodEmoji}

Average mood this week: ${avgMood.toFixed(1)}/5

${avgMood >= 4 ? "You've been feeling great! Keep doing what's working." :
  avgMood >= 3 ? "You're doing okay. Consider what small changes might boost your mood." :
  "Your mood has been lower lately. Remember to take breaks and do things you enjoy."}

Logging your mood daily helps identify patterns. Have you tracked how you're feeling today?`;
  }

  // Calendar queries
  if (lastMessage.includes('calendar') || lastMessage.includes('schedule') || lastMessage.includes('meeting') || lastMessage.includes('event')) {
    if (todayEvents.length === 0) {
      return `Your calendar is clear today! 📅 This is a great opportunity for deep work or tackling those larger projects.

You have ${incompleteTasks.length} tasks that could use your attention.`;
    }

    const eventList = todayEvents.map((e) =>
      `• ${e.startTime} - ${e.title}${e.endTime ? ` (until ${e.endTime})` : ''}`
    ).join('\n');

    return `**Today's Schedule** 📅

${eventList}

You have ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today. Plan your deep work around these commitments for maximum productivity.`;
  }

  // Productivity tips
  if (lastMessage.includes('tip') || lastMessage.includes('advice') || lastMessage.includes('help') || lastMessage.includes('productive')) {
    const tips = [
      "Try the 2-minute rule: If a task takes less than 2 minutes, do it now.",
      "Block time for deep work when you're most alert - for most people, that's morning.",
      "Take regular breaks. The Pomodoro technique suggests 25 min work, 5 min break.",
      "End each day by planning tomorrow. It reduces morning decision fatigue.",
      "Batch similar tasks together to minimize context switching.",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return `**Productivity Tip** 💡

${randomTip}

Based on your data:
- You have ${incompleteTasks.length} pending tasks
- Your current habit streak: ${Math.max(...habits.map(h => h.currentStreak), 0)} days
- Focus time today: ${Math.round(totalFocusToday / 60)} minutes

What specific area would you like help with?`;
  }

  // Default response
  return `I'm here to help you stay productive, ${userName}! Here's what I can help with:

**📋 Tasks & Priorities**
- "What should I focus on?" - Get task recommendations
- "Show my tasks" - See your to-do list

**📊 Insights**
- "Summarize my day" - Get an overview
- "How are my habits?" - Check streak progress

**💡 Suggestions**
- "Give me a productivity tip"
- "Help me plan my day"

Just ask, and I'll provide personalized advice based on your data!`;
}

export function analyzeCapture(text: string): 'task' | 'note' | 'event' | 'unknown' {
  const lowerText = text.toLowerCase();

  // Task indicators
  const taskWords = ['todo', 'to-do', 'need to', 'must', 'should', 'have to', 'don\'t forget', 'remember to', 'buy', 'call', 'email', 'send', 'finish', 'complete', 'fix', 'update'];
  if (taskWords.some((word) => lowerText.includes(word))) {
    return 'task';
  }

  // Event indicators
  const eventWords = ['meeting', 'appointment', 'call at', 'schedule', 'at ', 'pm', 'am', 'tomorrow', 'next week', 'on monday', 'on tuesday', 'on wednesday', 'on thursday', 'on friday'];
  if (eventWords.some((word) => lowerText.includes(word))) {
    return 'event';
  }

  // Note indicators (longer text, ideas, etc.)
  if (text.length > 100 || lowerText.includes('idea') || lowerText.includes('thought') || lowerText.includes('note')) {
    return 'note';
  }

  // Default to task for short actionable items
  if (text.length < 50) {
    return 'task';
  }

  return 'unknown';
}

export function generateDailyInsight(context: SecondBrainContext): string {
  const { tasks, habits, focusSessions } = context;
  const incompleteTasks = tasks.filter((t) => !t.completed);
  const highPriorityCount = incompleteTasks.filter((t) => t.priority === 'high').length;
  const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);
  const todaySessions = focusSessions.filter((s) => isToday(new Date(s.date))).length;

  const insights = [
    highPriorityCount > 2 && `You have ${highPriorityCount} high-priority tasks. Consider focusing on these first.`,
    maxStreak >= 7 && `Amazing ${maxStreak}-day streak! Keep the momentum going.`,
    maxStreak >= 3 && maxStreak < 7 && `You're building a ${maxStreak}-day streak. Consistency is key!`,
    todaySessions >= 4 && "Great focus today! Remember to take breaks.",
    todaySessions === 0 && "Consider starting a focus session to boost productivity.",
    incompleteTasks.length === 0 && "All tasks complete! Time to set new goals.",
    incompleteTasks.length > 10 && "Your task list is getting long. Consider prioritizing or delegating.",
  ].filter(Boolean);

  return insights[Math.floor(Math.random() * insights.length)] ||
    "You're most productive on Fridays. Consider tackling your hardest task now.";
}
