import * as React from "react";
import { Globe } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/app/i18n/settings";

export function LanguageToggle() {
  const serverHeaders = headers();
  const language = serverHeaders.get("next-url")?.replace("/", "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          {language}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lng) => (
          <Link href={`/${lng}`} key={lng}>
            <DropdownMenuItem>{lng}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
