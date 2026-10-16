const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  auth: {
    login: (login) => ipcRenderer.invoke('auth:login', login)
  },
  products: {
    getAll: () => ipcRenderer.invoke('products:getAll')
  },
  variants: {
    updatePrice: (id, price) => ipcRenderer.invoke('variants:updatePrice', { id, price })
  },
  orders: {
    getAll: () => ipcRenderer.invoke('orders:getAll'),
    bulk: (user_id, items) => ipcRenderer.invoke('orders:bulk', { user_id, items }),
    delete: (id) => ipcRenderer.invoke('orders:delete', id)
  }
});