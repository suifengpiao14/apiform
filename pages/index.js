import React, { Fragment, useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import Theme from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import axios from 'axios';
import { runBefore, runAfter } from '../lib/functions';
import URL from 'url-parse'
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
  const [loadDataError, setLoadDataError] = useState(null)
  const router = useRouter();
  const { api } = router.query;
  const { schema, uiSchema } = allSchema

  useEffect(() => {
    if (!api) {
      return
    }
    setLoading(true)
    fetch(api)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(res.statusText)
      })
      .then((data) => {
        const { example, ...allSchema } = data
        setAllSchema(allSchema)
        setFormData(example)
      }).catch((err) => {
        setLoadDataError(err)
      }).finally(() => {
        setLoading(false)
      })
  }, [api])
  if (loadDataError) return <div>{loadDataError}</div>
  if (isLoading) return <div>Loading...</div>
  return <Fragment>
    <Form
      schema={schema}
      formData={formData}
      uiSchema={uiSchema}
      validator={validator}
      onChange={({ formData }) => setFormData(formData)}
      onSubmit={({ formData }) => request(formData).then(res => {
        setResponseData(res.data)
      })}
    />
    <br />
    <div>
      返回信息:
      {JSON.stringify(responseData, " ")}
    </div>
  </Fragment>;
};



/**
 * 
 * @param {*} formData 
 * @returns 
 */
const proxy = "http://doc-proxy.huishoubao.com"
function request(formData) {
  const { service: { method, path, requestPreScript, variables, server: serverName, serverData: servers, requestPostScript }, ...data } = formData
  const server = filterServer(serverName, servers)
  data.variables = variables
  runBefore(requestPreScript, data)
  data.header = data.header || {}
  const url = new URL(server.host)
  data.header["X-REAL-HOST"] = url.host
  if (server.proxy != "") {
    data.header["X-REAL-ADDRESS"] = server.proxy
  }
  const config = {
    url: path,
    method,
    baseURL: proxy,
    headers: data.header,
    params: data.query,
    timeout: 30000000,
    withCredentials: true,
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


