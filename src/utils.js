import _ from 'lodash'
import Vue from 'vue'
import Axios from 'axios'
import Firebase from 'firebase/app'
import Murmur from 'murmurhash-js'
import ObjectHash from 'object-hash'
import HttpStatus from 'http-status-codes'
import Base64 from 'base-64'
import UTF8 from 'utf8'
import { Buffer } from 'buffer'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

const Utils = {
  async firebaseLogin (firebaseCreds) {
    if (!Firebase.apps.length) {
      Firebase.initializeApp({
        apiKey: firebaseCreds.apiKey,
        authDomain: `${firebaseCreds.projectId}.firebaseapp.com`,
        projectId: firebaseCreds.projectId,
        databaseURL: `https://${firebaseCreds.projectId}.firebaseio.com`
      })
    }

    return Firebase.auth().signInWithCustomToken(firebaseCreds.accessToken)
  },

  async firebaseLogout () {
    return Firebase.auth().signOut()
  },

  firebase () {
    return Firebase.database()
  },

  firestore () {
    return Firebase.firestore()
  },

  startLoading (ctx) {
    ctx.dispatch('loading/start', null, { root: true })
  },

  endLoading (ctx) {
    ctx.dispatch('loading/done', null, { root: true })
  },

  error (err, msg) {
    if (msg) {
      Snackbar.open({
        duration: 5000,
        message: msg,
        type: 'is-danger',
        position: 'is-bottom-left'
      })
    }

    if (err && process.env.ENV !== 'prod') {
      if (err.response) {
        // axios error
        console.log(err.response)
      } else {
        console.log(err)
      }
    }
  },

  msg (msg) {
    Snackbar.open({
      duration: 5000,
      message: msg,
      type: 'is-warning',
      position: 'is-bottom-left'
    })
  },

  async callApi (ctx, path, params, authenticated) {
    const url = process.env.APIBOY_BACKEND_URL + path
    let options = {}

    if (authenticated) {
      options = {
        headers: {
          Authorization: 'Bearer ' + ctx.rootGetters['auth/jwt']
        }
      }
    }

    return Axios.post(url, params, options)
  },

  setProp (obj, props, value) {
    const prop = props.shift()

    if (!obj[prop]) {
      Vue.set(obj, prop, {})
    }

    if (!props.length) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        obj[prop] = { ...obj[prop], ...value }
      } else {
        obj[prop] = value
      }

      return
    }

    Utils.setProp(obj[prop], props, value)
  },

  deleteProp (obj, props) {
    const prop = props.shift()

    if (!obj[prop]) {
      return
    }

    if (!props.length) {
      Vue.delete(obj, prop)
      return
    }

    Utils.deleteProp(obj[prop], props)
  },

  randomIntFromString (str) {
    let hash = Murmur.murmur3(str) / 10000000000

    if (hash < 0.1) {
      hash = hash * 10
    }

    return Math.floor(hash * (1000))
  },

  picsumImage (id, size) {
    return `https://picsum.photos/id/${id}/${size}`
  },

  equalRequests (req1, req2) {
    const hash1 = ObjectHash({
      id: req1.id,
      type: req1.type,
      url: req1.url,
      headers: req1.headers,
      body: req1.body
    })

    const hash2 = ObjectHash({
      id: req2.id,
      type: req2.type,
      url: req2.url,
      headers: req2.headers,
      body: req2.body
    })

    return hash1 === hash2
  },

  async sendRequest (request, environment, retryOnError) {
    let response = {
      status: 0,
      statusText: '',
      headers: {},
      body: '',
      time: 0,
      size: 0
    }

    // insert values for the environment variables
    let url = request.url
    let body = request.body
    const headers = request.headers

    if (environment) {
      _.forOwn(environment.variables, (val, key) => {
        const regEx = new RegExp('{{' + key + '}}', 'g')

        url = url.replace(regEx, val)
        body = body.replace(regEx, val)

        _.forOwn(headers, (hval, hkey) => {
          headers[hkey] = hval.replace(regEx, val)
        })
      })
    }

    // check if the url is absolute
    const regex = new RegExp('^(?:[a-z]+:)?//', 'i')

    if (!regex.test(url)) {
      Utils.msg('Seems that the URL of the request has an invalid format.')
      response.statusText = 'Network Error'
      return response
    }

    // send request
    let timeout = false
    const start = Date.now()

    try {
      const resp = await Axios.request({
        url: url,
        method: request.type.toLowerCase(),
        headers: headers,
        data: body,
        timeout: 60 * 1000 // 1 minute
      })

      response = {
        status: resp.status,
        headers: resp.headers,
        body: resp.data
      }
    } catch (err) {
      if (err.response) {
        response = {
          status: err.response.status,
          headers: err.response.headers,
          body: err.response.data
        }
      } else if (err.code === 'ECONNABORTED') {
        timeout = true
      } else if (retryOnError) {
        // this could be due to a CORS error -> retry using a proxy
        const req = _.cloneDeep(request)
        req.url = 'https://cors-anywhere.herokuapp.com/' + req.url
        const resp = await Utils.sendRequest(req, environment, false)

        // directly return the response if we received an error different than
        // ECONNREFUSED from the proxy, and continue with the normal processing
        // if it is -> this will end up returning a Network Error below
        if (!Utils.isProxyConnectionRefusedError(resp)) {
          return resp
        }
      }
    }

    response.time = Date.now() - start
    response.size = Buffer.byteLength(response.body)

    if (response.status) {
      response.statusText = HttpStatus.getStatusText(response.status)
    } else if (timeout) {
      response.statusText = 'Timeout'
    } else {
      response.statusText = 'Network Error'
    }

    return response
  },

  isProxyConnectionRefusedError (resp) {
    return resp.status === 404 && resp.body && typeof resp.body === 'string' && resp.body.indexOf('ECONNREFUSED') >= 0
  },

  encodeShareCode (userId, projectId) {
    return Base64.encode(UTF8.encode(userId + '|' + projectId))
  },

  decodeShareCode (input) {
    if (!input) return null

    const decoded = UTF8.decode(Base64.decode(input))
    const splitted = decoded.split('|')

    if (splitted.length !== 2) return null

    return {
      userId: splitted[0],
      projectId: splitted[1]
    }
  }
}

export default Utils
