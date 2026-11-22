interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceSchemaOptions {
  name: string;
  serviceType: string;
  description: string;
  url: string;
  breadcrumbName: string;
  faqs: FaqItem[];
}

export function buildServiceSchema(options: ServiceSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://scoutpc.ru/' },
          { '@type': 'ListItem', position: 2, name: options.breadcrumbName, item: options.url },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${options.url}#service`,
        name: options.name,
        serviceType: options.serviceType,
        description: options.description,
        provider: { '@id': 'https://scoutpc.ru/#localbusiness' },
        areaServed: { '@type': 'City', name: 'Краснодар' },
        url: options.url,
      },
      {
        '@type': 'FAQPage',
        mainEntity: options.faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}
