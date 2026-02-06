export const dynamic = "force-dynamic"
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  PreviewProvider,
  PreviewBanner,
  PreviewContent,
  PreviewTitle,
  PreviewBody,
  PreviewMeta,
  PreviewFeaturedImage,
} from '@/components/preview';
import { fetchPreviewPost, fetchDraftPost, type WPPost } from '@/lib/wordpress-api';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    preview?: string;
    id?: string;
    postType?: string;
    token?: string;
  }>;
}

import { Highlighter } from "@/components/ui/highlighter"
import { Mail } from "lucide-react"
import { AnimatedContactHero } from "@/components/animated-contact-hero"
import Image from "next/image"

export const metadata = {
  title: "Contact",
  description:
    "Contactez Les États Généraux Communaux. Envoyez-nous un email pour toute question ou pour rejoindre le mouvement.",
}

export default async function ContactPage({ params, searchParams }: PageProps) {
  const contactEmail = "lesetatsgenerauxcommunaux@gmail.com"

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 relative overflow-hidden">
      {/* Animated background pictos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/design-mode/picto202.png"
          alt=""
          width={64}
          height={64}
          className="absolute left-[5%] top-[10%] w-16 h-16 object-contain opacity-20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Image
          src="/images/design-mode/picto200.png"
          alt=""
          width={80}
          height={80}
          className="absolute right-[8%] top-[15%] w-20 h-20 object-contain opacity-15 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <Image
          src="/images/design-mode/picto204.png"
          alt=""
          width={96}
          height={96}
          className="absolute left-[10%] bottom-[20%] w-24 h-24 object-contain opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <Image
          src="/images/design-mode/picto205.png"
          alt=""
          width={64}
          height={64}
          className="absolute right-[5%] bottom-[15%] w-16 h-16 object-contain opacity-20 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <Image
          src="/images/design-mode/picto203.png"
          alt=""
          width={48}
          height={48}
          className="absolute left-[50%] top-[5%] w-12 h-12 object-contain opacity-15 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Animated Hero Section with Logo */}
        <AnimatedContactHero />

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 font-[family-name:var(--font-raleway)]">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              Contactez-nous
            </Highlighter>
          </h2>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Pour toute question, suggestion ou pour rejoindre le mouvement des États Généraux Communaux, n'hésitez pas
              à nous écrire.
            </p>

            {/* Email Display */}
            <div className="bg-white border border-[#4AAD33] rounded-lg p-8 shadow-lg relative overflow-hidden">
              {/* Decorative corner picto */}
              <div className="absolute -top-4 -right-4 z-10">
                <Image
                  src="/images/design-mode/picto200.png"
                  alt=""
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <Mail className="w-8 h-8 text-[#E73628]" />
                <h3 className="text-2xl font-bold uppercase font-[family-name:var(--font-raleway)]">Email</h3>
              </div>

              <a
                href={`mailto:${contactEmail}`}
                className="text-xl md:text-2xl font-semibold text-[#4AAD33] hover:text-[#E73628] transition-colors duration-300 break-all"
              >
                {contactEmail}
              </a>

              <p className="mt-6 text-sm text-muted-foreground">
                Cliquez sur l'adresse email pour nous envoyer un message directement depuis votre client de messagerie.
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-[#FFF9E6] border border-[#FFD700] rounded-lg p-6">
                <Image
                  src="/images/design-mode/picto202.png"
                  alt=""
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mx-auto mb-4"
                />
                <h4 className="font-bold text-lg mb-2 uppercase font-[family-name:var(--font-raleway)]">
                  Rejoignez-nous
                </h4>
                <p className="text-sm text-muted-foreground">
                  Créez vos Etats Généraux Communaux et vos Assemblées citoyennes communales dans votre territoire.
                </p>
              </div>

              <div className="bg-[#FFE6E6] border border-[#E73628] rounded-lg p-6">
                <Image
                  src="/images/design-mode/picto204.png"
                  alt=""
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mx-auto mb-4"
                />
                <h4 className="font-bold text-lg mb-2 uppercase font-[family-name:var(--font-raleway)]">
                  Posez vos questions
                </h4>
                <p className="text-sm text-muted-foreground">
                  Nous sommes là pour répondre à toutes vos interrogations sur notre mouvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function PageRoute({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview, id, postType, token } = await searchParams;
  const draft = await draftMode();
  
  const isPreviewMode = draft.isEnabled || preview === 'true';

  let page: WPPost | null = null;

  if (isPreviewMode && id) {
    // Fetch draft/preview content
    page = await fetchDraftPost({
      id,
      postType: postType || 'page',
      token,
    });
  } else {
    // Fetch published content
    page = await ContactPage({ params, searchParams });
  }

  if (!page) {
    notFound();
  }

  return (
    <PreviewProvider
      initialPost={page}
      postId={id || page.id}
      postType={postType || 'page'}
      token={token}
      isPreview={isPreviewMode}
    >
      {/* Preview Banner - Only visible in preview mode */}
      <PreviewBanner />

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 ${isPreviewMode ? 'mt-12' : ''}`}>
        <PreviewContent>
          {/* Featured Image */}
          <PreviewFeaturedImage 
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />

          {/* Page Header */}
          <header className="mb-8">
            <PreviewTitle className="text-4xl md:text-5xl font-bold" />
          </header>

          {/* Page Content */}
          <PreviewBody className="prose lg:prose-xl max-w-none" />
        </PreviewContent>
      </main>
    </PreviewProvider>
  );
}