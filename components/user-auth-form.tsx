"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Icons } from "./icons";
import { User } from "@prisma/client";

const FormSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["PARENT", "STAFF"]),
  name: z.string(),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  parents: User[];
  staffs: User[];
}
export function UserAuthForm({
  className,
  parents,
  staffs,
  ...props
}: UserAuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: staffs[0].id,
      role: staffs[0].role as "STAFF" | "PARENT",
      name: staffs[0].name ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        id: data.id,
        role: data.role,
        name: data.name,
      });

      if (result && result.ok) {
        const role = data.role === "PARENT" ? "保護者" : "職員";
        const path = data.role === "PARENT" ? "/calendar" : "/admin/schedules";
        router.push(path);
        setTimeout(() => {
          toast({
            title: `${data.name}としてログインしました`,
          });
          setLoading(false);
        }, 1000);
      } else {
        throw new Error(result?.error ?? "unknown error");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        title: "ログインに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-center gap-2"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(v) => {
                  field.onChange(v);
                  const staff = staffs.find((staff) => staff.id === v);
                  const parent = parents.find((parent) => parent.id === v);
                  if (typeof staff !== "undefined") {
                    form.setValue("role", staff.role as "STAFF" | "PARENT");
                    form.setValue("name", staff.name ?? "");
                  } else if (typeof parent !== "undefined") {
                    form.setValue("role", parent.role as "STAFF" | "PARENT");
                    form.setValue("name", parent.name ?? "");
                  } else {
                    return;
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger onBlur={field.onBlur}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>職員</SelectLabel>
                    {staffs.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>保護者</SelectLabel>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>として</p>
        <Button type="submit" disabled={loading}>
          {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          ログイン
        </Button>
      </form>
    </Form>
  );
}
