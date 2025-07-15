// start/views.ts
import edge from 'edge.js'  // Built-in in AdonisJS 6
import { getSignedUrl } from '#services/uploader'

// Register getSignedUrl globally for Edge templates
edge.global('getSignedUrl', getSignedUrl)