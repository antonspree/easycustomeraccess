import type { Metadata } from "next"
import { InviteMemberForm } from "@/components/agency-forms"
import { CopyLink } from "@/components/copy-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { removeMemberAction, revokeInviteAction } from "@/lib/actions"
import { requireSession } from "@/lib/auth"
import { publicOrigin } from "@/lib/origin"
import { formatDateTime } from "@/lib/text"
import { listInvites, listMembers } from "@/lib/workspace"

export const metadata: Metadata = { title: "Team" }
export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const { agency, member } = await requireSession()
  const people = await listMembers(agency.id)
  const invites = (await listInvites(agency.id)).filter((invite) => !invite.accepted_at)
  const origin = await publicOrigin()
  const owner = member.role === "inhaber"

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl">Team von {agency.name}</h1>
        <p className="text-sm text-muted-foreground">
          Alle Personen sehen dieselben Kunden. Einladen, Entfernen und Archivieren bleibt bei der Inhaberin oder dem Inhaber.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personen</CardTitle>
          <CardDescription>Jede Person hat eine eigene Anmeldung.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {people.map((person) => (
            <div key={person.id} className="flex flex-wrap items-center gap-2 border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.email}</p>
              </div>
              <Badge variant={person.role === "inhaber" ? "default" : "secondary"}>
                {person.role === "inhaber" ? "Inhaber" : "Mitarbeit"}
              </Badge>
              {owner && person.id !== member.id ? (
                <form action={removeMemberAction}>
                  <input type="hidden" name="memberId" value={person.id} />
                  <Button type="submit" variant="outline" size="sm">
                    Entfernen
                  </Button>
                </form>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      {owner ? (
        <Card>
          <CardHeader>
            <CardTitle>Mitarbeit einladen</CardTitle>
            <CardDescription>
              Kopieren Sie den Link und schicken Sie ihn selbst. Die App versendet keine E-Mail.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InviteMemberForm />
            {invites.length > 0 ? (
              <div className="flex flex-col gap-4">
                {invites.map((invite) => (
                  <div key={invite.token} className="flex flex-col gap-2">
                    <p className="text-sm">
                      {invite.email} · offen seit {formatDateTime(invite.created_at)}
                    </p>
                    <CopyLink url={`${origin}/beitreten/${invite.token}`} />
                    <form action={revokeInviteAction}>
                      <input type="hidden" name="token" value={invite.token} />
                      <Button type="submit" variant="outline" size="sm">
                        Einladung zurückziehen
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Keine offene Einladung.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Einladungen</CardTitle>
            <CardDescription>
              Neue Personen lädt die Inhaberin oder der Inhaber ein.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
