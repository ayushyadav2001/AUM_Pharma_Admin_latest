import { object, string, pipe, nonEmpty, file, mimeType, maxSize } from 'valibot'

const ImageSchema = pipe(
  file('Please select an image file.'),
  mimeType(['image/jpeg', 'image/png'], 'Please select a JPEG or PNG file.'),
  maxSize(1024 * 1024 * 10, 'Please select a file smaller than 10 MB.')
)

const basicInfoSchema = object({
  product_id: pipe(string(), nonEmpty('Product ID is required')),
  product_name: pipe(string(), nonEmpty('Product Name is required')),
  mrp: pipe(string(), nonEmpty('MRP is required')),
  igst: pipe(string(), nonEmpty('IGST is required')),
  hsn: pipe(string(), nonEmpty('HSN is required')),
  manufacturer: pipe(string(), nonEmpty('Manufacturer is required')),
  category: pipe(string(), nonEmpty('Category is required')),
  sub_category: pipe(string(), nonEmpty('Sub-category is required')),
  vendor_id: pipe(string(), nonEmpty('Vendor is required')),
  product_image: ImageSchema
})

const productDetailsSchema = object({
  composition: pipe(string(), nonEmpty('Composition is required')),
  packing_type: pipe(string(), nonEmpty('Packing Type is required')),
  packaging: pipe(string(), nonEmpty('Packaging is required')),
  Schedule: pipe(string(), nonEmpty('Schedule is required')),
  usage: pipe(string(), nonEmpty('Usage is required')),
  about_salt: pipe(string(), nonEmpty('About Salt is required')),
  mechanism_of_action: pipe(string(), nonEmpty('Mechanism of Action is required')),
  pharmacokinets: pipe(string(), nonEmpty('Pharmacokinets is required')),
  onset_of_action: pipe(string(), nonEmpty('Onset of Action is required')),
  duration_of_action: pipe(string(), nonEmpty('Duration of Action is required')),
  half_life: pipe(string(), nonEmpty('Half Life is required'))
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
  product_id: '',
  product_name: '',
  mrp: '',
  igst: '',
  hsn: '',
  manufacturer: '',
  category: '',
  sub_category: '',
  vendor_id: '',
  product_image: null
}

const additionalInfoSchema = object({
  expert_advice: pipe(string(), nonEmpty('Expert Advice is required')),
  how_to_use: pipe(string(), nonEmpty('How to Use is required')),
  faqs: pipe(string(), nonEmpty('FAQs are required'))
})

const productDetailsDefaultValues = {
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
  half_life: ''
}

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
