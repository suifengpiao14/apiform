import React from 'react';
import { withTheme } from '@rjsf/core';
import Theme from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
// Make modifications to the theme with your own fields and widgets

const Form = withTheme(Theme);
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
  const error = null
  //const { data, error } = useSWR(api, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { schema, example, uiSchema } = data
  const [formData, setFormData] = React.useState(example);
  return <Form
    schema={schema}
    formData={formData}
    uiSchema={uiSchema}
    validator={validator}
    onChange={({ formData }) => setFormData(formData)}
    onSubmit={({ formData }) => console.log('form submitted', formData)}
  />;
};


/**
 * {
        
        "service": {
        "method": "POST",
        "path": "/admin/v1/ad/list",
        "description": "广告列表",
            "requestPreScript": "var signature=\"javascript\"",
            "variables": [
                {
                    "name": "serviceId",
                    "value": "1234,xyuientg,74ere",
                    "description": "服务ID"
                }
            ],
            "server": "dev"
        },
        "title": "新年豪礼",
        "advertiserId": "123",
        "beginAt": "2023-01-12 00:00:00",
        "endAt": "2023-01-30 00:00:00",
        "index": "0",
        "size": "10",
        "content-type": "application/json",
        "appid": "",
        "signature": ""
    }
 * 
 * 
 */

/**
 * 
 * @param {*} formData 
 * @returns 
 */

function Request(formData) {
  const { service: { method, path, description, requestPreScript, variables, server, servers, requestPostScript }, ...data } = formData
  return
}
