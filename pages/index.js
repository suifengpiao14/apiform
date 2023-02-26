import React from 'react';
import MaterialJsonSchemaForm from 'react-jsonschema-form-material-ui';

//import schema from '../simple/schema.json';
//import uiSchema from '../simple/ui-schema.json';
//import givenFormData from '../simple/form-data.json';
import data from '../simple/data.json';
import { useRouter } from 'next/router';
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default () => {
  const router = useRouter();
  const { api } = router.query;
  //const data={schema:{},example:{},uiSchema:{}}
  const error=null
  //const { data, error } = useSWR(api, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const{schema,example,uiSchema}=data
  const [formData, setFormData] = React.useState(example);
  return <MaterialJsonSchemaForm 
            schema={schema}  
            formData={formData} 
            uiSchema={uiSchema}
            onChange={({ formData }) => setFormData(formData)}
            onSubmit={() => console.log('form submitted',formData)}
          />;
};
