// // import the **type** HttpContext and alias it to avoid conflict
// import type { HttpContext as BaseHttpContext } from '@adonisjs/core/http'

// declare module '@adonisjs/core/http' {
//   interface HttpContext extends BaseHttpContext {
//     getSuggestedUsers(): Promise<Array<{
//       id: number
//       firstName: string
//       surname: string
//       username: string
//       avatar: string
//     }>>
//   }
// }
