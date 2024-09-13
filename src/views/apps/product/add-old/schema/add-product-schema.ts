import {
  object,
  string,
  pipe,
  nonEmpty,
  file,
  mimeType,
  maxSize,
  boolean,
  optional,
  nullable,
  minLength,
  array
} from 'valibot'

const ImageSchema = pipe(
  file('Please select an image file.'),
  mimeType(['image/jpeg', 'image/png'], 'Please select a JPEG or PNG file.'),
  maxSize(1024 * 1024 * 10, 'Please select a file smaller than 10 MB.')
)

const objectId = string()

const ArrayLengthSchema = pipe(array(objectId), minLength(1, 'At least one item is required.'))

const basicInfoSchema = object({
  product_code: pipe(string(), nonEmpty('Product Code is required')),
  product_image: ImageSchema, // Assuming ImageSchema is defined with appropriate rules
  product_name: pipe(string(), nonEmpty('Product Name is required')),

  // category: pipe(string(), nonEmpty('Category is required')),
  // sub_category: pipe(string(), nonEmpty('Sub-category is required')),

  category: ArrayLengthSchema,
  sub_category: ArrayLengthSchema,
  sec_sub_categories: ArrayLengthSchema,
  manufacturer: pipe(string(), nonEmpty('Manufacturer is required')),
  product_form: pipe(string(), nonEmpty('Product Form is required')),

  packaging: pipe(string(), nonEmpty('Packaging is required')),
  packing_type: pipe(string(), nonEmpty('Packing Type is required')),

  mrp: pipe(string(), nonEmpty('MRP is required')),

  discount: optional(nullable(pipe(string(), nonEmpty('Discount is required')))),

  prescription_required: boolean(),
  stock_management_required: boolean(),
  alert_quantity: pipe(string(), nonEmpty('Alert Quantity is required when stock management is enabled'))
})

// const productDetailsSchema = object({
//   introduction: optional(nullable(pipe(string(), nonEmpty('Introduction is required')))),
//   description: optional(nullable(pipe(string(), nonEmpty('Description is required')))),
//   salt_composition: optional(nullable(pipe(string(), nonEmpty('Salt Composition is required')))),
//   benefits: optional(nullable(pipe(string(), nonEmpty('Benefits is required')))),
//   use_of: optional(nullable(pipe(string(), nonEmpty('Use of is required')))),
//   how_to_use: optional(nullable(pipe(string(), nonEmpty('How to Use is required')))),
//   safety_advice: optional(nullable(pipe(string(), nonEmpty('Safety advice is required')))),
//   ingredients: optional(nullable(pipe(string(), nonEmpty('Ingredients is required')))),
//   primary_use: optional(nullable(pipe(string(), nonEmpty('Primary use is required')))),
//   storage: optional(nullable(pipe(string(), nonEmpty('Storage is required')))),
//   common_side_effects: optional(nullable(pipe(string(), nonEmpty('Common Side Effects is required')))),
//   alcohol_interaction: optional(nullable(pipe(string(), nonEmpty('Alcohol Interaction is required')))),
//   pregnancy_interaction: optional(nullable(pipe(string(), nonEmpty('Pregnancy Interaction is required')))),
//   lactation_interaction: optional(nullable(pipe(string(), nonEmpty('Lactation Interaction is required')))),
//   driving_interaction: optional(nullable(pipe(string(), nonEmpty('Driving Interaction is required')))),
//   kidney_interaction: optional(nullable(pipe(string(), nonEmpty('Kidney Interaction is required')))),
//   liver_interaction: optional(nullable(pipe(string(), nonEmpty('Liver Interaction is required')))),
//   country_of_origin: optional(nullable(pipe(string(), nonEmpty('Country of origin is required')))),
//   faqs: optional(nullable(pipe(string(), nonEmpty('Faqs is required'))))),
// })

const productDetailsSchema = object({
  introduction: pipe(string(), nonEmpty('Introduction is required')),
  description: pipe(string(), nonEmpty('Description is required')),
  salt_composition: optional(nullable(pipe(string(), nonEmpty('Salt Composition is required')))),
  benefits: optional(nullable(pipe(string(), nonEmpty('Benefits is required')))),
  use_of: optional(nullable(pipe(string(), nonEmpty('Use of is required')))),
  how_to_use: optional(nullable(pipe(string(), nonEmpty('How to Use is required')))),
  safety_advice: optional(nullable(pipe(string(), nonEmpty('Safety advice is required')))),
  ingredients: optional(nullable(pipe(string(), nonEmpty('Ingredients is required')))),
  primary_use: optional(nullable(pipe(string(), nonEmpty('Primary use is required')))),
  storage: optional(nullable(pipe(string(), nonEmpty('Storage is required')))),
  common_side_effects: optional(nullable(pipe(string(), nonEmpty('Common Side Effects is required')))),
  alcohol_interaction: optional(nullable(pipe(string(), nonEmpty('Alcohol Interaction is required')))),
  pregnancy_interaction: optional(nullable(pipe(string(), nonEmpty('Pregnancy Interaction is required')))),
  lactation_interaction: optional(nullable(pipe(string(), nonEmpty('Lactation Interaction is required')))),
  driving_interaction: optional(nullable(pipe(string(), nonEmpty('Driving Interaction is required')))),
  kidney_interaction: optional(nullable(pipe(string(), nonEmpty('Kidney Interaction is required')))),
  liver_interaction: optional(nullable(pipe(string(), nonEmpty('Liver Interaction is required')))),
  country_of_origin: optional(nullable(pipe(string(), nonEmpty('Country of origin is required')))),
  faqs: optional(nullable(pipe(string(), nonEmpty('Faqs is required'))))
})

const healthInfoSchema = object({
  side_effects: pipe(string(), nonEmpty('Side Effects are required')),
  contra_indications: pipe(string(), nonEmpty('Contra-indications are required')),
  special_precautions_while_taking: pipe(string(), nonEmpty('Special Precautions while taking are required')),
  pregnancy_related_information: pipe(string(), nonEmpty('Pregnancy Related Information is required')),
  product_and_alcohol_interaction: pipe(string(), nonEmpty('Product and Alcohol Interaction is required')),
  old_age_related_information: pipe(string(), nonEmpty('Old Age Related Information is required')),
  breast_feeding_related_information: pipe(string(), nonEmpty('Breast Feeding Related Information is required')),
  children_related_information: pipe(string(), nonEmpty('Children Related Information is required')),
  indications: pipe(string(), nonEmpty('Indications are required')),
  interactions: pipe(string(), nonEmpty('Interactions are required')),
  typical_dosage: pipe(string(), nonEmpty('Typical Dosage is required')),
  storage_requirements: pipe(string(), nonEmpty('Storage Requirements are required')),
  effects_of_missed_dosage: pipe(string(), nonEmpty('Effects of Missed Dosage are required')),
  effects_of_overdose: pipe(string(), nonEmpty('Effects of Overdose are required'))
})

const basicInfoDefaultValues = {
  product_code: '',
  product_image: null,
  product_name: '',
  category: [],
  sub_category: [],
  sec_sub_categories: [],
  manufacturer: '',
  product_form: '',
  packaging: '',
  packing_type: '',
  mrp: '',
  discount: null,
  prescription_required: false,
  stock_management_required: true,
  alert_quantity: ''
}

const additionalInfoSchema = object({
  expert_advice: pipe(string(), nonEmpty('Expert Advice is required')),
  how_to_use: pipe(string(), nonEmpty('How to Use is required')),
  faqs: pipe(string(), nonEmpty('FAQs are required'))
})

const productDetailsDefaultValues = {
  introduction: '',
  description: '',
  salt_composition: null,
  benefits: null,
  use_of: null,
  how_to_use: null,
  safety_advice: null,
  ingredients: null,
  primary_use: null,
  storage: null,
  common_side_effects: null,
  alcohol_interaction: null,
  pregnancy_interaction: null,
  lactation_interaction: null,
  driving_interaction: null,
  kidney_interaction: null,
  liver_interaction: null,
  country_of_origin: null,
  faqs: null
}

// const productDetailsDefaultValues = {
//   introduction: '',
//   description: '',
//   salt_composition: '',
//   benefits: '',
//   use_of: '',
//   how_to_use: '',
//   safety_advice: '',
//   ingredients: '',
//   primary_use: '',
//   storage: '',
//   common_side_effects: '',
//   alcohol_interaction: '',
//   pregnancy_interaction: '',
//   lactation_interaction: '',
//   driving_interaction: '',
//   kidney_interaction: '',
//   liver_interaction: '',
//   country_of_origin: '',
//   faqs: ''
// }

const healthDetailsDefaultValues = {
  side_effects: '',
  contra_indications: '',
  special_precautions_while_taking: '',
  pregnancy_related_information: '',
  product_and_alcohol_interaction: '',
  old_age_related_information: '',
  breast_feeding_related_information: '',
  children_related_information: '',
  indications: '',
  interactions: '',
  typical_dosage: '',
  storage_requirements: '',
  effects_of_missed_dosage: '',
  effects_of_overdose: ''
}

const additionalInfoDefaultValues = {
  expert_advice: '',
  how_to_use: '',
  faqs: ''
}

const createProductSchema = {
  basicInfoSchema,
  productDetailsSchema,
  healthInfoSchema,
  additionalInfoSchema,
  basicInfoDefaultValues,
  additionalInfoDefaultValues,
  healthDetailsDefaultValues,
  productDetailsDefaultValues
}

export default createProductSchema
