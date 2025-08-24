'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export function UrlForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const encodedUrl = encodeURIComponent(values.url);
    router.push(`/report?url=${encodedUrl}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <div className="flex w-full items-start space-x-2">
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    className="h-12 text-base"
                    aria-label="Website URL"
                  />
                </FormControl>
                <Button type="submit" size="lg" className="h-12" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Analyze</span>
                      <ArrowRight className="h-5 w-5 sm:hidden" />
                    </>
                  )}
                  <span className="sr-only">Analyze Website</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
