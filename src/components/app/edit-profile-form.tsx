
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";
import { updateProfile } from "@/app/dashboard/portfolio/actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(280, { message: "Bio cannot be longer than 280 characters."}).optional(),
  photo: z.string().optional(),
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type EditProfileFormProps = {
  currentUser: {
    name: string;
    bio: string;
    photoURL?: string;
    linkedinUrl?: string;
  };
  userId: string;
  onProfileUpdate: (updatedProfile: Partial<ProfileFormValues & { photoURL?: string }>) => void;
};

export default function EditProfileForm({ currentUser, userId, onProfileUpdate }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(currentUser.photoURL || null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name || "",
      bio: currentUser.bio || "",
      photo: "",
      linkedinUrl: currentUser.linkedinUrl || "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue("photo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const result = await updateProfile(userId, data);
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
        onProfileUpdate({ ...data, photoURL: imagePreview || currentUser.photoURL });
        router.refresh(); // Refresh server components
        router.push('/dashboard/portfolio'); // Redirect to portfolio after update
      } else {
        throw new Error(result.error);
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                   <FormLabel>Profile Photo</FormLabel>
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={imagePreview ?? undefined} />
                        <AvatarFallback>
                            <User className="h-12 w-12 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                  <FormControl>
                    <Input 
                      type="file" 
                      className="max-w-xs mx-auto file:text-primary file:font-semibold"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handlePhotoChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                    <Textarea placeholder="Tell us a little about yourself" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>LinkedIn Profile URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
        </form>
    </Form>
  );
}
