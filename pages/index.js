import React from 'react';
import { withTheme } from '@rjsf/core';
import Theme from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import axios from 'axios';
import { runBefore,runAfter } from '../lib/functions';
import URL from 'url-parse'
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
    onSubmit={({ formData }) => request(formData)}
  />;
};



/**
 * 
 * @param {*} formData 
 * @returns 
 */

function request(formData) {
  const { service: { method, path, requestPreScript, variables, server:serverName, serverData:servers, requestPostScript }, ...data } = formData
  const server = filterServer(serverName,servers)
  data.variables=variables
  runBefore(requestPreScript,data)
  const config={
    url: path,
    method,
    baseURL:server.host,
    transformRequest:[
      function(data,headers){
      return data
    }
  ],
  headers:data.header,
  params:data.query,
  timeout: 30000000,
  withCredentials:true,
   }
   if (server.proxy!=""){
    debugger
    const url = new URL(server.proxy);
    const protocol = url.protocol.replace(":","")
    config.proxy={
      protocol:protocol,
      host:url.host,
      port:url.port
    }
   }
  axios.request(config).then(res=>{
    runAfter(requestPostScript,res)
  })
  return
}

function filterServer(name,servers){
  let server={}
  servers.forEach(element => {
    if (element.name==name){
      server = element
    }
  });
  return server
}
