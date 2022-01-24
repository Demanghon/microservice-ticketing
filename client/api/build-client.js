import axios from 'axios'

const buildClient = ({req}) => {
    if(typeof window === 'undefined'){
        return axios.create({
            baseURL: 'https://ingress-nginx-controller.ingress-nginx',
            headers: req.headers
        })
    }
    return axios.create({
        baseURL: "/"
    })
}

export default buildClient;