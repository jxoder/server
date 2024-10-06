export enum FORM_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  SELECT = 'select',
  SLIDE = 'slide',
}

export interface IFormBase {
  type: FORM_TYPE
  label?: string
  name: string
  required: boolean
}

export interface IFormText extends IFormBase {
  type: FORM_TYPE.TEXT
  defaultValue?: string
}

export interface IFormTextarea extends IFormBase {
  type: FORM_TYPE.TEXTAREA
  defaultValue?: string
}

export interface IFormNumber extends IFormBase {
  type: FORM_TYPE.NUMBER
  defaultValue?: number
}

export interface IFormSelect extends IFormBase {
  type: FORM_TYPE.SELECT
  values: Array<{ label: string; value: string }>
  defaultValue?: { label: string; value: string }
}

export interface IFormSlide extends IFormBase {
  type: FORM_TYPE.SLIDE
  defaultValue?: number
  min: number
  max: number
  step?: number
}

export type FormDataType =
  | IFormText
  | IFormTextarea
  | IFormNumber
  | IFormSelect
  | IFormSlide
