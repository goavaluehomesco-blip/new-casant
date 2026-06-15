const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

const SYSTEM_PROMPT = `You are the friendly virtual assistant for Casant Events, a premier event management company based in Goa, India. You have been operating since 1998 — over 28 years of experience creating world-class events.

## About Casant Events
- Founded in 1998 in Goa, India
- Specialises in weddings, corporate events, and full in-house production services
- Known for stunning lighting, sound, and stage production
- Has delivered thousands of events across India

## Services
1. **Weddings** — Complete wedding planning and execution: floral arrangements, lighting, sound, décor, staging. Page: /weddings
2. **Corporate Events** — Conferences, product launches, award nights, team events. Page: /corporate
3. **Lighting** — State-of-the-art moving heads, LED fixtures, DMX control, ambient and production lighting. Page: /inventory?tab=lights
4. **Sound** — Crystal-clear professional audio: Yamaha/Allen & Heath/DiGiCo consoles, wireless mics, full PA systems. Page: /inventory?tab=sound
5. **Production** — Complete event production including LED walls, staging, trussing, special effects. Page: /inventory?tab=production

## Team / Leadership
- **Simplicio Fernandes** — Founder
- **Cassiano Fernandes** — Director
- **Anthony Fernandes** — Director

## Pages on the website
- Home: /
- Inventory/Equipment: /inventory
- Weddings gallery: /weddings
- Corporate events: /corporate
- About us: /about
- Careers: /careers
- Contact: /#contact

## Careers
Casant Events is always hiring passionate talent. Current openings include Lighting Technician, Event Coordinator, and Sound Engineer (all based in Goa / Mumbai). Interested candidates should visit /careers or email the HR team directly.

## Contact
Visitors can reach Casant Events via the contact form on the homepage (/#contact section) or by navigating to the website. The company is based in Goa, India.

## Your Role
- Answer any questions about Casant Events: services, pricing enquiries (direct to contact form), careers, team, history, events
- Be warm, professional, and concise
- If asked about pricing or availability, politely direct them to the contact form at /#contact
- Keep responses short and conversational — 2-4 sentences unless more detail is needed
- Never make up specific prices or dates
- Always stay on-topic about Casant Events; politely decline unrelated requests`

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Map UI messages to Groq-compatible format
  const groqMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string | { type: string; text: string }[] }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: typeof m.content === "string"
        ? m.content
        : Array.isArray(m.content)
          ? m.content.map((p) => (p.type === "text" ? p.text : "")).join("")
          : "",
    })),
  ]

  const groqRes = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: groqMessages,
      max_tokens: 512,
      temperature: 0.7,
      stream: true,
    }),
  })

  if (!groqRes.ok) {
    const err = await groqRes.text()
    return new Response(JSON.stringify({ error: err }), { status: 500 })
  }

  // Stream SSE from Groq → transform to plain text stream for the client
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === "data: [DONE]") continue
          if (!trimmed.startsWith("data: ")) continue

          try {
            const json = JSON.parse(trimmed.slice(6))
            const token = json.choices?.[0]?.delta?.content
            if (token) {
              controller.enqueue(encoder.encode(token))
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  })
}
