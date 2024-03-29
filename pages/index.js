import React, { Fragment, useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import Theme from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import axios from 'axios';
import { runBefore, runAfter } from '../lib/functions';
import URL from 'url-parse'
import merge from 'deepmerge-json';
// Make modifications to the theme with your own fields and widgets

const Form = withTheme(Theme);
//import schema from '../simple/schema.json';
//import uiSchema from '../simple/ui-schema.json';
//import givenFormData from '../simple/form-data.json';
//import data from '../simple/data.json';
import { useRouter } from 'next/router';


export default () => {
  const [responseData, setResponseData] = useState({})
  const [formData, setFormData] = React.useState({});
  const [isLoading, setLoading] = useState(false)

  const [allSchema, setAllSchema] = useState({ schema: {}, uiSchema: {} })
  const router = useRouter();
  const { api } = router.query;
  const { schema, uiSchema, defaultJson } = allSchema

  useEffect(() => {
    if (!api) {
      return
    }
    setLoading(true)
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        const { example, ...allSchema } = data
        setAllSchema(allSchema)
        setFormData(example)
        setLoading(false)
      })
  }, [api])

  if (isLoading) return <div>Loading...</div>
  return <Fragment>
    <Form
      schema={schema}
      formData={formData}
      uiSchema={uiSchema}
      validator={validator}
      onChange={({ formData }) => setFormData(formData)}
      onSubmit={({ formData }) => {
        const requestData = merge(defaultJson, formData)
        return request(requestData).then(res => {
          setResponseData(res.data)
        })
      }}
    />
    <br />
    <div>
      返回信息:
      <pre>
        {JSON.stringify(responseData, " ", 2)}
      </pre>

    </div>
  </Fragment>;
};



/**
 * 
 * @param {*} formData 
 * @returns 
 */
function request(formData) {
  const { service: { method, path, requestPreScript, variables, server: serverName, serverData: servers, requestPostScript }, ...data } = formData
  const server = filterServer(serverName, servers)
  data.variables = variables
  runBefore(requestPreScript, data)
  data.header = data.header || {}
  data.header["X-REAL-DOMAIN"] = server.domain
  data.header["X-REAL-IP"] = server.ip
  let baseURL = server.httpProxy
  if (!baseURL) {
    const url = new URL(server.domain)
    if (!!server.ip) {
      url.host = server.ip
    }
    baseURL = url.toString()
  }
  if (method?.toLowerCase()=="get"){
    data.query = data.body
    data.body=null
  }
  const config = {
    url: path,
    method,
    baseURL: baseURL,
    headers: data.header,
    params: data.query,
    timeout: 30000000,
    withCredentials: false,
    data: data.body
  }

  return axios.request(config).then(res => {
    runAfter(requestPostScript, res)
    return res
  })
}

function filterServer(name, servers) {
  let server = {}
  servers.forEach(element => {
    if (element.name == name) {
      server = element
    }
  });
  return server
}


