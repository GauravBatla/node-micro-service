module.exports ={
   router: [
      {
          prefix: '/api/user',
          target: 'http://127.0.0.1:5013'
      },
      {
          // middlewares:[],
          prefix: '/api/categorie',
          target: 'http://127.0.0.1:5001'
      },
      {
          // middlewares:[],
          prefix: '/api/permission',
          target: 'http://127.0.0.1:5004'
      },
      {
          // middlewares:[],
          prefix: '/api/sub-categorie',
          target: 'http://127.0.0.1:5005'
      },
      {
          // middlewares:[],
          prefix: '/api/attribute',
          target: 'http://127.0.0.1:4001'
      },
      {
          prefix: "/api/products",
          target: 'http://127.0.0.1:5008'
      },
      {
          prefix: "/api/vendors",
          target: 'http://127.0.0.1:5002',
      },
      {
          prefix: "/api/vendorProduct",
          target: 'http://127.0.0.1:5010',
      },
      {
          prefix: "/api/offers",
          target: 'http://127.0.0.1:5006',
      },
      {
          prefix: "/api/coupans",
          target: 'http://127.0.0.1:5003',
      },
      {
          prefix: "/api/carts",
          target: 'http://127.0.0.1:5011',
      },
      {
          prefix: "/api/area",
          target: 'http://127.0.0.1:5009',
      },
      {
          prefix: "/api/delivery",
          target: 'http://127.0.0.1:5018',
      },
      {
          prefix: "/api/setting",
          target: 'http://127.0.0.1:5019'
      },
      {
          prefix: "/api/customer-address",
          target: 'http://127.0.0.1:5020'
      },
      {
          prefix: "/api/orders",
          target: 'http://127.0.0.1:5021'
      },
      {
          prefix: "/api/dahsboard",
          target: 'http://127.0.0.1:5039'
      }
  ]
}