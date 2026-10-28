"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/toast";
import { SettingsRow } from "@/features/account/components/settings-row";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import type { LearningPreferences } from "@/types/account";
import { LANGUAGE_LABELS, type CodeLanguage } from "@/types/practice";

const CODE_LANGUAGES: CodeLanguage[] = ["python", "java", "cpp", "javascript", "go"];

export function LearningPreferencesForm({
  initial,
  voices,
}: {
  initial: LearningPreferences;
  voices: { value: string; label: string }[];
}) {
  const { toast } = useToast();
  const [prefs, setPrefs] = React.useState(initial);
  const save = useSimulatedAction(() => toast({ title: "Preferences saved", variant: "success" }), 800);

  function set<K extends keyof LearningPreferences>(key: K, value: LearningPreferences[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coding</CardTitle>
          <CardDescription>Defaults for the coding workspace. You can still switch language per problem.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow label="Default language">
            <Select value={prefs.defaultLanguage} onValueChange={(v) => set("defaultLanguage", v as CodeLanguage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {LANGUAGE_LABELS[l]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow label="Editor font size" description={`${prefs.editorFontSize}px`}>
            <Slider
              min={12}
              max={20}
              step={1}
              value={[prefs.editorFontSize]}
              onValueChange={([v]) => set("editorFontSize", v ?? 14)}
              aria-label="Editor font size"
            />
          </SettingsRow>
          <SettingsRow label="Editor theme">
            <Select value={prefs.editorTheme} onValueChange={(v) => set("editorTheme", v as LearningPreferences["editorTheme"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match app theme</SelectItem>
                <SelectItem value="light">Always light</SelectItem>
                <SelectItem value="dark">Always dark</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study plan</CardTitle>
          <CardDescription>Your daily goal drives streaks and reminder timing.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow label="Daily goal" description={`${prefs.dailyGoalHours} hour${prefs.dailyGoalHours === 1 ? "" : "s"} a day`}>
            <Slider
              min={0.5}
              max={4}
              step={0.5}
              value={[prefs.dailyGoalHours]}
              onValueChange={([v]) => set("dailyGoalHours", v ?? 2)}
              aria-label="Daily goal in hours"
            />
          </SettingsRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mock interviews</CardTitle>
          <CardDescription>How the voice interviewer sounds.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow label="Interviewer voice and accent">
            <Select value={prefs.interviewVoice} onValueChange={(v) => set("interviewVoice", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow label="Speaking pace">
            <Select value={prefs.speechPace} onValueChange={(v) => set("speechPace", v as LearningPreferences["speechPace"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slower">Slower</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="faster">Faster</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
        </CardContent>
        <CardFooter className="justify-end">
          <Button disabled={save.isLoading} onClick={save.run}>
            {save.isLoading && <LoaderCircle className="animate-spin" />}
            Save preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
