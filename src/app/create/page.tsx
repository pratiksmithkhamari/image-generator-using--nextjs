"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be at least 7 characters long!" }),
});

export default function Page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        setOutputImg(data.url);
        toast({
          description: "Image generated successfully!",
          className: "bg-green-500 text-white",
        });
      } else {
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-dvh bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto pt-[72px]">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <p className="text-lg text-white/60">
            Transform your imagination into stunning visuals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                Enter Your Prompt
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="A mystical forest with glowing butterflies..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden transition-all duration-300 relative min-h-[400px]">
            {outputImg ? (
              <div className="relative w-full h-full min-h-[400px]">
                <Image
                  alt="Generated image"
                  className="object-contain w-full h-full transition-opacity duration-300"
                  src={outputImg}
                  width={500}
                  height={500}
                  priority
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 p-6 text-center">
                <ImageIcon className="w-16 h-16 mb-4 animate-pulse" />
                <p className="text-lg">
                  Your masterpiece will appear here...
                </p>
                <p className="text-sm mt-2">
                  Be creative with your prompt!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}