'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.jsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import schemaTypes from './src/sanity/schemaTypes'
import {dashboardTool} from '@sanity/dashboard'
import {documentListWidget} from 'sanity-plugin-dashboard-widget-document-list'
import {sanityTablePlugin} from 'sanity-plugin-table'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {structure} from './src/sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'SIGNALS',
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    dashboardTool({
      widgets: [
        documentListWidget({
          title: 'Last edited projects',
          query: '*[_type == "project"] | order(_updatedAt desc)',
          layout: { width: 'full' }
        })
      ]
    }),
    sanityTablePlugin(),
  ],
})
