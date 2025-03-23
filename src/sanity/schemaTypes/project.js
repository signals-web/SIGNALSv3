import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Book', value: 'book' },
          { title: 'Signage', value: 'signage' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Monograph', value: 'monograph' },
          { title: 'Editorial', value: 'editorial' },
          { title: 'History & Preservation', value: 'history-preservation' },
          { title: 'Architecture & Philosophy', value: 'architecture-philosophy' },
          { title: 'Architectural History', value: 'architectural-history' },
          { title: 'Interior Design', value: 'interior-design' },
          { title: 'Facsimile and Reproduction', value: 'facsimile' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'object',
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
              name: 'externalImageUrl',
              title: 'External Image URL',
              type: 'url',
              description: 'URL for images hosted on Raster or other platforms',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'A brief description of the image',
            },
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility',
              validation: Rule => Rule.required(),
            },
            {
              name: 'credit',
              title: 'Credit',
              type: 'string',
              description: 'Photo credit or attribution',
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which the image appears in the gallery (optional)',
            },
            {
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags'
              }
            },
            {
              name: 'sourceInfo',
              title: 'Source Information',
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Sanity', value: 'sanity' },
                      { title: 'Raster', value: 'raster' },
                      { title: 'Other', value: 'other' }
                    ]
                  }
                },
                {
                  name: 'id',
                  title: 'External ID',
                  type: 'string',
                  description: 'ID of the image in the external platform (e.g., Raster ID)'
                },
                {
                  name: 'metadata',
                  title: 'Additional Metadata',
                  type: 'object',
                  fields: [
                    {
                      name: 'width',
                      title: 'Width',
                      type: 'number'
                    },
                    {
                      name: 'height',
                      title: 'Height',
                      type: 'number'
                    },
                    {
                      name: 'format',
                      title: 'Format',
                      type: 'string'
                    }
                  ]
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'caption',
              subtitle: 'credit',
              media: 'image',
              externalUrl: 'externalImageUrl'
            },
            prepare({ title, subtitle, media, externalUrl }) {
              return {
                title: title || 'Untitled',
                subtitle: subtitle,
                media: media || externalUrl
              }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
        },
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'projectDate',
      title: 'Project Date',
      type: 'object',
      fields: [
        {
          name: 'startDate',
          title: 'Start Date',
          type: 'date',
        },
        {
          name: 'endDate',
          title: 'End Date',
          type: 'date',
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Typography', value: 'typography' },
          { title: 'Wayfinding', value: 'wayfinding' },
          { title: 'Editorial', value: 'editorial' },
          { title: 'Exhibition', value: 'exhibition' },
          { title: 'Identity', value: 'identity' },
        ],
      },
    }),
    defineField({
      name: 'projectYear',
      title: 'Project Year',
      type: 'number',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
    }),
    defineField({
      name: 'designElements',
      title: 'Design Elements',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
        },
      ],
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      type: 'type',
      media: 'mainImage'
    },
    prepare({ title, subtitle, type, media }) {
      return {
        title,
        subtitle: subtitle || type.charAt(0).toUpperCase() + type.slice(1),
        media,
      }
    },
  },
}) 