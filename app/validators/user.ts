import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(50),
    email: vine.string().trim().email().maxLength(50),
    password: vine.string().trim().minLength(8).maxLength(50),
    surname: vine.string().trim().maxLength(20).nullable(), // Optional, can be null
    firstName: vine.string().trim().maxLength(20).nullable(), // Optional, can be null

    // dateOfBirth: vine.date().nullable(), // Optional, can be null
    // city: vine.string().trim().maxLength(100).nullable(),
    // website: vine.string().trim().url().maxLength(255).nullable(),
    // avatar: vine
    // .file({
    //   size: '2mb',
    //   extnames: ['jpg', 'png', 'jpeg', 'webp'],
    // })
    // .nullable(),

    // bannerImage: vine
    // .file({
    //   size: '5mb',
    //   extnames: ['jpg', 'png', 'jpeg', 'webp'],
    // })
    // .nullable(),
    // bio: vine.string().trim().maxLength(100).nullable(),
    // isVerified: vine.boolean(),
    // isPrivate: vine.boolean(),
    // followersCount: vine.number().withoutDecimals(),
    // followingCount: vine.number().withoutDecimals(),
    // postsCount: vine.number().withoutDecimals(),
    })
)