import * as yup from 'yup'

const productValidationSchema = yup.object().shape({
  product_code: yup.string().required('Product Code is required'),
  product_image: yup.mixed().required('Product Image is required'),
  product_name: yup.string().required('Product Name is required'),
  category: yup.string().required('Category is required'),
  sub_category: yup.string().required('Sub-category is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  manufacturer_address: yup.string().required('Manufacturer address is required'),
  packaging: yup.string().required('Packaging is required'),
  packing_type: yup.string().required('Packing Type is required'),
  quantity: yup.string().required('Quantity Type is required'),
  product_form: yup.string().required('Product form Type is required'),
  mrp: yup.string().required('MRP is required'),
  discount: yup.string().required('Discount is required'),

  prescription_required: yup.boolean().notRequired().default(false),
  stock_management_required: yup.boolean().notRequired().default(false),

  igst: yup.string().required('IGST is required'),
  hsn: yup.string().required('HSN is required'),
  composition: yup.string().required('Composition is required'),
  Schedule: yup.string().required('Schedule is required'),
  usage: yup.string().required('Usage is required'),
  about_salt: yup.string().required('About Salt is required'),
  mechanism_of_action: yup.string().required('Mechanism of Action is required'),
  pharmacokinets: yup.string().required('Pharmacokinets is required'),
  onset_of_action: yup.string().required('Onset of Action is required'),
  duration_of_action: yup.string().required('Duration of Action is required'),
  half_life: yup.string().required('Half Life is required'),
  side_effects: yup.string().required('Side Effects are required'),
  contra_indications: yup.string().required('Contra-indications are required'),
  special_precautions_while_taking: yup.string().required('Special Precautions while taking are required'),
  pregnancy_related_information: yup.string().required('Pregnancy Related Information is required'),
  product_and_alcohol_interaction: yup.string().required('Product and Alcohol Interaction is required'),
  old_age_related_information: yup.string().required('Old Age Related Information is required'),
  breast_feeding_related_information: yup.string().required('Breast Feeding Related Information is required'),
  children_related_information: yup.string().required('Children Related Information is required'),
  indications: yup.string().required('Indications are required'),
  interactions: yup.string().required('Interactions are required'),
  typical_dosage: yup.string().required('Typical Dosage is required'),
  storage_requirements: yup.string().required('Storage Requirements are required'),
  effects_of_missed_dosage: yup.string().required('Effects of Missed Dosage are required'),
  effects_of_overdose: yup.string().required('Effects of Overdose are required'),
  expert_advice: yup.string().required('Expert Advice is required'),
  how_to_use: yup.string().required('How to Use is required'),
  faqs: yup.string().required('FAQs are required')
})

const defaultValues = {
  product_id: '',
  product_name: '',
  mrp: '',
  igst: '',
  hsn: '',
  manufacturer: '',
  composition: '',
  packing_type: '',
  packaging: '',
  Schedule: '',
  usage: '',
  about_salt: '',
  mechanism_of_action: '',
  pharmacokinets: '',
  onset_of_action: '',
  duration_of_action: '',
  half_life: '',
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
  effects_of_overdose: '',
  expert_advice: '',
  how_to_use: '',
  faqs: '',
  category: '',
  sub_category: '',
  vendor_id: '',
  product_image: ''
}

// Separate Schemas
const basicInfoSchema = yup.object().shape({
  product_code: yup.string().required('Product Code is required'),
  product_image: yup.mixed().required('Product Image is required'),
  product_name: yup.string().required('Product Name is required'),
  category: yup.string().required('Category is required'),
  sub_category: yup.string().required('Sub-category is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  manufacturer_address: yup.string().required('Manufacturer address is required'),
  packaging: yup.string().required('Packaging is required'),
  packing_type: yup.string().required('Packing Type is required'),
  quantity: yup.string().required('Quantity Type is required'),

  mrp: yup.string().required('MRP is required'),
  discount: yup.string().required('Discount is required'),

  prescription_required: yup.boolean().notRequired().default(false),
  stock_management_required: yup.boolean().notRequired().default(false),
  alert_quantity: yup.string().notRequired().default('0')
})

const productDetailsSchema = yup.object().shape({
  introduction: yup.string().required('Introduction is required'),
  description: yup.string().required('Description is required'),

  salt_composition: yup.string().required('Salt Composition is required'),
  benefits: yup.string().required('Benefits is required'),

  primary_use: yup.string().required('Primary Use is required'),

  use_of: yup.string().required('Use Of is required'),

  how_to_use: yup.string().required('How to use is required'),

  safety_advice: yup.string().required('Safety Advice is required'),

  ingredients: yup.string().required('Ingredients is required'),

  storage: yup.string().required('Storage is required'),
  common_side_effects: yup.string().required('Common Side Effects is required'),
  alcohol_interaction: yup.string().required('Alcohol interaction is required'),
  pregnancy_interaction: yup.string().required('Pregnancy interaction is required'),
  lactation_interaction: yup.string().required('Lactation interaction is required'),
  driving_interaction: yup.string().required('Driving interaction is required'),
  kidney_interaction: yup.string().required('Kidney interaction is required'),
  liver_interaction: yup.string().required('Liver interaction is required'),
  country_of_origin: yup.string().required('Country Of Origin is required'),
  faqs: yup.string().required('Faqs is required')
})

const healthInfoSchema = yup.object().shape({
  side_effects: yup.string().required('Side Effects are required'),
  contra_indications: yup.string().required('Contra-indications are required'),
  special_precautions_while_taking: yup.string().required('Special Precautions while taking are required'),
  pregnancy_related_information: yup.string().required('Pregnancy Related Information is required'),
  product_and_alcohol_interaction: yup.string().required('Product and Alcohol Interaction is required'),
  old_age_related_information: yup.string().required('Old Age Related Information is required'),
  breast_feeding_related_information: yup.string().required('Breast Feeding Related Information is required'),
  children_related_information: yup.string().required('Children Related Information is required'),
  indications: yup.string().required('Indications are required'),
  interactions: yup.string().required('Interactions are required'),
  typical_dosage: yup.string().required('Typical Dosage is required'),
  storage_requirements: yup.string().required('Storage Requirements are required'),
  effects_of_missed_dosage: yup.string().required('Effects of Missed Dosage are required'),
  effects_of_overdose: yup.string().required('Effects of Overdose are required')
})

const additionalInfoSchema = yup.object().shape({
  expert_advice: yup.string().required('Expert Advice is required'),
  how_to_use: yup.string().required('How to Use is required'),
  faqs: yup.string().required('FAQs are required')
})

// Default Values for Each Schema
const basicInfoDefaultValues = {
  product_code: '',
  product_image: null,
  product_name: '',
  category: '',
  sub_category: '',
  manufacturer: '',
  manufacturer_address: '',
  packaging: '',
  packing_type: '',
  quantity: '',
  product_form: '',
  mrp: '',
  discount: '',
  prescription_required: false,
  stock_management_required: false,
  alert_quantity: '0'
}

const productDetailsDefaultValues = {
  introduction: '',
  description: '',
  salt_composition: '',
  benefits: '',
  primary_use: '',
  use_of: '',
  how_to_use: '',
  safety_advice: '',
  ingredients: '',
  storage: '',
  common_side_effects: '',
  alcohol_interaction: '',
  pregnancy_interaction: '',
  lactation_interaction: '',
  driving_interaction: '',
  kidney_interaction: '',
  liver_interaction: '',
  country_of_origin: '',
  faqs: ''
}

const healthInfoDefaultValues = {
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
  productValidationSchema,
  defaultValues,
  basicInfoSchema,
  productDetailsSchema,
  healthInfoSchema,
  additionalInfoSchema,
  basicInfoDefaultValues,
  productDetailsDefaultValues,
  healthInfoDefaultValues,
  additionalInfoDefaultValues
}

export default createProductSchema
