import axios from 'axios'

const personsDbUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(personsDbUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(personsDbUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${personsDbUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = id => {
    const request = axios.delete(`${personsDbUrl}/${id}`)
    return request.then(response => response.status)
}

export default { getAll, create, update, remove }