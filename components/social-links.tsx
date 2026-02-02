import React, { useEffect, useState } from "react";
import { getSocialLinks } from "../lib/wordpress";
import Image from "next/image";

interface SocialLink {
  reseau_social_url?: string;
  icone?: {
    url?: string;
    alt?: string;
  };
}

const SocialLinks: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSocialLinks()
      .then((data) => {
        if (Array.isArray(data)) {
          setLinks(data);
        } else {
          setLinks([]);
        }
      })
      .catch((err) => {
        setLinks([]);
      });
  }, []);

  const html = (
    <div className="flex items-center gap-4">
      {links.map((item, idx) =>
        item.reseau_social_url ? (
          <a
            key={item.reseau_social_url + idx}
            href={item.reseau_social_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.icone?.alt || `Réseau social ${idx + 1}`}
            className="text-gray-500 hover:text-[#E73628] transition-colors"
          >
            {item.icone?.url ? (
              <Image src={item.icone.url} alt={item.icone.alt || ''} width={20} height={20} className="w-5 h-5 object-contain" />
            ) : null}
          </a>
        ) : null
      )}
    </div>
  );
  // Log la structure HTML pour debug
  useEffect(() => {
    console.warn('[SocialLinks] links state:', links);
  }, [links]);
  return html;
};

export default SocialLinks;
