import {Handlers, PageProps} from '$fresh/server.ts'
import {z, ZodError} from 'zod'

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData()

    const title = form.get('title')?.toString()
    const result = CreateTimelineSchema.safeParse({
      title,
    })

    if (!result.success) {
      return ctx.render({error: result.error, form: {title}}, {status: 400})
    }

    const newTimeline = result.data
    console.log('got timeline', {newTimeline})

    const headers = new Headers()
    headers.set('location', `/timeline/${newTimeline.title}`)
    return new Response(null, {status: 303, headers})
  },
}

export default function CreateTimeline(props: PageProps<CreateTimelineState>) {
  const {error, form} = props.data || {}
  const errors = error?.flatten()
  return (
    <>
      <h1 class="text-4xl font-bold">New timeline</h1>
      <form method="post" class="mt-4 inline-flex flex-col gap-1">
        <label for="title">Title</label>
        <input type="title" name="title" value={form?.title} required />
        <div>{errors?.fieldErrors.title}</div>
        <button type="submit">Create</button>
      </form>
    </>
  )
}

interface CreateTimelineState {
  form?: Form
  error?: CreateTimelineError
}

interface Form {
  title?: string
}

const CreateTimelineSchema = z.object({
  title: z.string().min(2, {message: 'Please provide a title of at least 2 characters'}),
})
type CreateTimelineInput = z.infer<typeof CreateTimelineSchema>
type CreateTimelineError = ZodError<CreateTimelineInput>