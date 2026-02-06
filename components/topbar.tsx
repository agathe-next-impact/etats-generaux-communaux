import Link from 'next/link';
import { getEvents } from '@/lib/wordpress';
import { ArrowRight } from 'lucide-react';

export async function Topbar() {
  const events = await getEvents();

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const parts = dateString.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter for future events and sort by date ascending (closest first)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = parseDate(event.acf?.date || '');
      return eventDate && eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = parseDate(a.acf?.date || '')!.getTime();
      const dateB = parseDate(b.acf?.date || '')!.getTime();
      return dateA - dateB;
    });

  // Take the closest upcoming event
  let eventToShow = upcomingEvents[0];
  let label = "Prochain événement";

  // Fallback to the latest published event if no upcoming events exist
  if (!eventToShow) {
    eventToShow = events[0];
    label = "Dernier événement";
  }

  if (!eventToShow) return null;

  const { title, slug, acf } = eventToShow;
  const date = acf?.date;
  const targetUrl = acf?.lien_vers_levenement_en_ligne || `/evenements/${slug}`;
  const isExternal = !!acf?.lien_vers_levenement_en_ligne;

  return (
    <div className="bg-[#E73628] text-white py-2 px-1 md:px-4 text-sm relative z-50">
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <div className="flex  items-center gap-2 justify-center sm:justify-start flex-wrap">
          <span className="uppercase font-extrabold tracking-wider bg-white text-[#E73628] px-2 py-0.5 text-xs rounded-sm inline-block">
            {label}
          </span>
          <Link 
            href={targetUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="hover:underline font-semibold truncate md:max-w-[200px] sm:max-w-md max-w-[200px]"
            dangerouslySetInnerHTML={{ __html: title.rendered }}
          />
          {date && (
             <span className="opacity-90 inline">
             {date}
             </span>
          )}
        </div>
        <Link 
          href={targetUrl} 
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="flex items-center gap-1 hover:underline whitespace-nowrap font-medium group"
        >
          {isExternal ? "Participer" : "En savoir plus"}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
