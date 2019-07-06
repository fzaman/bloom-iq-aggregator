import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Attestation from "@src/types/models/attestation"

export type reqBody = {
  show_attestation: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
}
export type reqQuery = {}

export type respBody = {
  attestation: Attestation.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
