"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import CheckBoxField from '@/components/Fields/CheckBoxField'
import RadioField from '@/components/Fields/RadioField'
import SelectField from '@/components/Fields/SelectField'
import StringField from '@/components/Fields/StringField'
import SwitchField from '@/components/Fields/SwitchField'
import { FormDataSchema } from '@/lib/data'
import { editFieldType } from '@/lib/type'
import { Form } from '@/components/ui/form'

const formData = {
  "formTitle": "Comprehensive User Information Form",
  "formHeading": "Please fill out all relevant information",
  "fields": [
    {
      "fieldName": "userEmail",
      "fieldType": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "required": true
    },
    {
      "fieldName": "fullName",
      "fieldType": "string",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "min": 2,
      "max": 100,
      "required": true
    },
    {
      "fieldName": "age",
      "fieldType": "number",
      "label": "Age",
      "placeholder": "Enter your age",
      "min": 18,
      "max": 120,
      "required": true
    },
    {
      "fieldName": "phoneNumber",
      "fieldType": "tel",
      "label": "Phone Number",
      "placeholder": "+1234567890",
      "required": false
    },
    {
      "fieldName": "website",
      "fieldType": "url",
      "label": "Personal Website",
      "placeholder": "https://example.com",
      "required": false
    },
    {
      "fieldName": "birthDate",
      "fieldType": "date",
      "label": "Date of Birth",
      "required": true
    },
    {
      "fieldName": "country",
      "fieldType": "select",
      "label": "Country of Residence",
      "required": true,
      "options": [
        {
          "label": "United States",
          "value": "us"
        },
        {
          "label": "Canada",
          "value": "ca"
        },
        {
          "label": "United Kingdom",
          "value": "uk"
        }
      ]
    },
    {
      "fieldName": "interests",
      "fieldType": "checkbox",
      "label": "Areas of Interest",
      "required": false,
      "options": [
        {
          "label": "Technology",
          "value": "tech"
        },
        {
          "label": "Sports",
          "value": "sports"
        },
        {
          "label": "Art",
          "value": "art"
        }
      ]
    },
    {
      "fieldName": "gender",
      "fieldType": "radio",
      "label": "Gender",
      "required": true,
      "options": [
        {
          "label": "Male",
          "value": "male"
        },
        {
          "label": "Female",
          "value": "female"
        },
        {
          "label": "Other",
          "value": "other"
        }
      ]
    },
    {
      "fieldName": "profilePicture",
      "fieldType": "file",
      "label": "Profile Picture",
      "required": false
    },
    {
      "fieldName": "newsletter",
      "fieldType": "switch",
      "label": "Subscribe to Newsletter",
      "required": false
    }
  ]
}

const Page = () => {
  const formObj = useForm();
  const { control } = formObj;


  const onFieldUpdate = (value: editFieldType, index: number) => {
    console.log(`Field ${index} updated:`, value);

  };


  const onFieldDelete = (index: number) => {
    console.log(`Field ${index} deleted`);
  };

  const renderField = (field: any, index: number) => {
    switch (field.fieldType) {
      case 'checkbox':
        return <CheckBoxField
          key={field.fieldName}
          control={control}
          fieldData={field}
          index={index}
          onFieldUpdate={onFieldUpdate}
          onFieldDelete={onFieldDelete}
        />
      case 'radio':
        return <RadioField
          key={field.fieldName}
          control={control}
          fieldData={field}
          index={index}
          onFieldUpdate={onFieldUpdate}
          onFieldDelete={onFieldDelete}
        />
      case 'select':
        return <SelectField
          key={field.fieldName}
          control={control}
          fieldData={field}
          index={index}
          onFieldUpdate={onFieldUpdate}
          onFieldDelete={onFieldDelete}
        />
      case 'switch':
        return <SwitchField
          key={field.fieldName}
          control={control}
          fieldData={field}
          index={index}
          onFieldUpdate={onFieldUpdate}
          onFieldDelete={onFieldDelete}
        />
      default:
        return <StringField
          key={field.fieldName}
          control={control}
          fieldData={field}
          index={index}
          onFieldUpdate={onFieldUpdate}
          onFieldDelete={onFieldDelete}
        />
    }
  }

  return (
    <div className='p-20'>
      <h1>{formData.formTitle}</h1>
      <p>{formData.formHeading}</p>
      <Form {...formObj} >

        <form onSubmit={formObj.handleSubmit((data) => console.log(data))}>
          {formData.fields.map((field, index) => renderField(field, index))}
          <button type="submit">Submit</button>
        </form>
      </Form>
    </div>
  )
}

export default Page