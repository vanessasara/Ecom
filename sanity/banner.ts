export default {
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'buttonText',
        title: 'Button Text',
        type: 'string',
      },
      {
        name: 'product',
        title: 'Product',
        type: 'string',
      },
      {
        name: 'desc',
        title: 'Description',
        type: 'string',
      },
      {
        name: 'smallText',
        title: 'Small Text',
        type: 'string',
      },
      {
        name: 'midText',
        title: 'Mid Text',
        type: 'string',
      },
      {
        name: 'largeText1',
        title: 'Large Text 1',
        type: 'string',
      },
      {
        name: 'largeText2',
        title: 'Large Text 2',
        type: 'string',
      },
      {
        name: 'discount',
        title: 'Discount',
        type: 'string',
      },
      {
        name: 'saleTime',
        title: 'Sale Time',
        type: 'string',
      },
      {
        name: 'bgColor',
        title: 'Background Color',
        type: 'string',
        description: 'CSS background color or gradient',
      },
    ],
  };
  