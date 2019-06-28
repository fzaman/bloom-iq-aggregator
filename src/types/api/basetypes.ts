export type TApiRoutes<TRq, TRs> = {
  method: TExpressHttpMethodFns
  paths: TExpressPathParams
  fn: TApiHandler<TRq, TRs> | Array<TApiHandler<TRq, TRs>>
  middleware?: THandlerOptions
}

export type TCurrentUserMock = {
  user: any
}

export type TBaseRequest = {
  body: {}
  params: {}
  query: {}
  headers: {}
  user: () => Promise<null | TCurrentUserMock>
  requireUser: () => Promise<TCurrentUserMock>
  signedCookies: {}
}

export interface IBaseResponse {
  status: number
  headers?: Object
  continue?: boolean // For pre-handler middleware, calls next() if true
  error?: string
  cookies?: TCookie[]
  clearCookies?: TClearCookie[]
}

export type TClearCookie = string
export type TCookie = {
  key: string
  value: string
  opts: {
    maxAge: number
    httpOnly: boolean
    signed: boolean
  }
}

export interface IJsonResponse extends IBaseResponse {
  json: {}
}

export interface IStringResponse extends IBaseResponse {
  body: string
}

export interface IRespErr extends IBaseResponse {
  json: {
    success: false
    error: string | Error
  }
}

export type TResponse = IStringResponse | IJsonResponse | IRespErr

export type TExpressPathParams = string | RegExp | Array<string | RegExp>

export type TExpressHttpMethodFns =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"

export type TApiHandler<TRq = TBaseRequest, TRs = TResponse> = (
  req: TRq
) => Promise<TRs>

export type THandlerOptions = {
  userRequired: boolean
  adminRequired: boolean
  userRateLimited?: number
  ipRateLimited?: number
  cacheDuration?: number
  custom?: any[]
}

export const unauthenticatedHandlerOptions = {
  userRequired: false,
  adminRequired: false
}

export const userHandlerOptions = {
  userRequired: true,
  adminRequired: false
}

export const adminHandlerOptions = {
  userRequired: false,
  adminRequired: true
}

export interface TReq<B = {}, P = {}, Q = {}, H = {}> extends TBaseRequest {
  body: B
  params: P
  query: Q
  headers: H
}

export interface TResp<J = { success?: true }> extends IBaseResponse {
  json: J & {
    success?: boolean
  }
}

export interface TRespB<B = {}> extends IBaseResponse {
  body: B
}

export type TRespE<J = {}> = TResp<J> | IRespErr

export type TRespEB<B = {}> = TRespB<B> | IRespErr

export type TRedir = { redirect: string }

export type TRedirE = IRespErr | TRedir
