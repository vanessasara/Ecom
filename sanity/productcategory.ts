export default {
    name: 'productscategory',
    title: 'Product Category',
    type: 'document',
    fields: [
        {
            name : 'categoryy',
            title:'Category Name',
            type:'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
              }
        },
        {
            name: 'category',
            title: 'Products Category',
            type: 'reference',
            to: [
                {
                    type: 'category'
                }
            ]
        }

    ]
}