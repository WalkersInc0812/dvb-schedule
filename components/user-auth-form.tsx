"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Icons } from "./icons";

const FormSchema = z.object({
  role: z.enum(["PARENT", "STAFF"]),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "STAFF",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        role: data.role,
      });

      if (result && result.ok) {
        const role = data.role === "PARENT" ? "保護者" : "職員";
        const path = data.role === "PARENT" ? "/calendar" : "/admin/schedules";
        router.push(path);
        setTimeout(() => {
          toast({
            title: `${role}としてログインしました`,
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STAFF">職員</SelectItem>
                  <SelectItem value="PARENT">保護者</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>として</p>
        <Button type="submit">
          {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          ログイン
        </Button>
      </form>
    </Form>
  );
}
