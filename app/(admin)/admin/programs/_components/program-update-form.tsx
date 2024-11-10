"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  programUpdateSchema,
  ProgramUpdateSchemaType,
} from "@/lib/validations/program";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Program } from "@prisma/client";

type Props = {
  program: Program;
  onSuccess?: () => void;
  onError?: () => void;
};

export const ProgramUpdateForm = ({ program, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<ProgramUpdateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(programUpdateSchema),
    defaultValues: {
      name: program.name,
      shortName: program.shortName ?? undefined,
    },
  });

  const handleSubmit = async (data: ProgramUpdateSchemaType) => {
    try {
      const response = await fetch(`/api/programs/${program.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update program");
      }

      toast({
        title: "習い事情報を変更しました",
        description: "テーブルに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "習い事情報の変更に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>習い事名</FormLabel>
              <FormControl>
                <Input {...field} placeholder="習い事名を入力してください" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>習い事名(省略形)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="習い事名(省略形)を入力してください"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            !form.formState.isValid ||
            form.formState.isLoading ||
            form.formState.isSubmitting
          }
        >
          {(form.formState.isLoading || form.formState.isSubmitting) && (
            <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
          )}
          この内容で習い事情報を変更する
        </Button>
      </form>
    </Form>
  );
};
