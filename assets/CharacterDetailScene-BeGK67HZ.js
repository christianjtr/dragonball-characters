import{r,a as h,j as e,R as g}from"./index-DY6ZjpEq.js";import{D as u,S as l,E as m,B as x,F as f}from"./fist-bump-GyohCuRH.js";const p=s=>{const[a,i]=r.useState(),[n,o]=r.useTransition(),[A,d]=r.useState(),t=r.useCallback(()=>{o(async()=>{try{const c=await u.getById(s);i(c)}catch(c){d(c)}})},[s]);return r.useEffect(()=>{t()},[t]),{character:a,isLoading:n,error:A,refetch:()=>t()}},j="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAXEAAAFxAGbebUAAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAACE1JREFUeJzFm2uQVFcRx3997z55E5BHJKSgeGRBagVTmhg1sJqQFVmIePfOLiHBUkMZrRLKioiauBqtUCYhptBoQVFBw2NnhxICGJJoYpVGsCLuQkoDSDBBxegHEAiwYZm57YeZCbuzM/c5d/1/mZnTfbp7/rfvmXP79AgDBLXt+4AHqaycLVu2vDVQfr1gDIQTte1G4AlgLOn0vIHw6RexE6CW9V6gHajIDuhNcfsMgvgzwDCeAIb1Grk5dp8BIHEa1+bm+Yg8VzB8hcuXx8iuXWfj9O0X8WaASFuR0UqqqqxY/QZAbASoZX0AKH6/i6zStrYBWYC9EF8QhvEZF2kdR49+JTbfARAfASIfcZWrPqy2XR+bf5+IjwDV6zw0qoEdalnjYovBB+K8D9WHzhQM4zldvHhEjHG4Ik4C3vSpV0919V5duHBQjLGURJwEdAbQvYXa2g69997K2KIpgTgJ+G0gbZEFnDu3SWPenBUiPgK6u18CegLOWoZtPxJHOKUQGwGye/fbqL4cYupXNZGwyx5QCcS9G3s21CzVJ3NPkbEjXgJMs/BByC+uwTC+U9ZYSiD2BUdt+yQwMcTUNI7zPkmljpU7pt6I/4FE5PmQMyswjC+VNZYiiJ8A1bC3AYi0qmVVlTGafqgohxFNJDahOoGenlbZufN0H2Fl5QGuXAlpWEdRUdEAhCfRA5EzQJuahqJ6F3A7VVUvq2UN7y3PVYBPhXaQyXw8YoiuiH4L1NTcDuTT9AYMY1MRreOh7YvMzb9V256my5aNCW2rCKITIPKpgpEl2tw8r0DnZAQPM9WyzJyd/fT0nFLb3qqJxLURbL6LSATo3LkVwIJ+ApH7+yrqOxHc1FJZOTln5zTZdasV1T+pZc2KYBeImgHjxs0H3lNEMr+g0GFG8pPJTMq9+09v74g8q62tI6OYjkZAdvErbtc0b+2lNzmSH5F8up8tGJ9AOv1QFNOhCcit9otKK+jHcnomhhGt9uc4Y3I2L/eTiXxOW1pGhzUdPgNEVgC1LhrZEyDTXIDqqNB+ssj7uaaIrAbHWRzWcCgCtLGxGljpoTZJLctEdXUYH30gUpN7nVlCYx6AtrUZatuLglSWwmXA0KF3IzLeQ2sEhvEo8OFQPvqiRi3rg8DYEvLZABw50gzs4uzZb/g1HJgAbWoaisi3fap7ZYlfDEHkYRd5fpGcn3td4fcZIngG1NQ8CAxIsaIX7kakwUU+XJcvryF3KyAyHsP4tB/DgQhQy5qByP/jSMv7al66dCtwfa+R+/wYDpYBIuuBuEvXp4BM4FkihcXUj2oi4XU65Z8Ate2ERxpGxd+AxSST1wHrQszvvy12nDu8JvkiQC1rCPBY8Jh8QqQDx6mXZPIZyR6pXSiT5UYvBX8ZYJpf4OpKW26slfZ2mzWVo7SrZUtZLYs0eB20eBKgc+dWoBrXwrdeksk12pm4EdEu4Lbc+Lky2R+OZbleOO8MGDu2ib6ra7nwa+rqVuphew4iLwAjgewBqUi5CACRaW5iP7eAr9/TgDiD4yznzhOjcYy9ZL88wBB9tXUkjlPOBqopbkJXAnIFj0+WMZg8HpFU6hROeiPQd0vtMBWRN8rmSWSwm9g9A8aPn87Vq1MunKG7+8fa2foJoKmfVJ0p1NYeI8xeoBhUXYsx7gQ4zoyyBNEbqhtl9+63Mfh6UbnILNm8+R2C9ReEhtca4LmT8oTIz4DDvT536OGlE1AtvqlSGnJ6YU+UCv27luTdCcg/h4fHKmlvXw58P/f5DHV1h8joQkr/Pt+oB62JiGwFnIj+8VpPvDIgyn34A0kmf5j1YuQPOA9KW5uDqFuNwMA0Pyvbtx8F9kTwD5DGNI+4KbgToBqur1/kAHV1a/SwPUe7Eq1Mn/5n4BSquQMSne5hYKUebBkNfA24GCqGbBx/lK1bz7upeC2CR0O47SGT+TyJvw/GMXeCcU/2qsuTGEaurG2UquzkMYIKWSfJ5F9RXULwVps89nkpuBMwcmQXwa/AzyWVeo3u7odAJ4Lepp0tN5PJPI7jvJJVUe8eQtVl2tXyTenoeB6RpfjrO+yNNKb5lJeSZ4OE2nY74LdnJ4Np1rHaPIemT6LkFlF9narMbJmZugCgXS0nAD9nBQq6Qma3b9Tm5nWIrPIZB6jukI4Oz650762wyEbfTmG/bNt2HOfKF69+eQCZwuWKHXp4meuurJh3kPXaaddTXf0A8A+f89KY5gN+FD0JkPb2FxE54Mut6gu5d/f0N8R8nPTvtTOxlmAPV9UYxlp5+umLwFqfcTyW+xXxhL96gOqXgbS3NeNXevCu8SCTSmjUI7KaoGeFyh3atfQWLl3ajFexROQAI0b4uvrgkwBJJjtR/Z6nYibzF8zMh/w6DwZnuezZcwn4pYvSvzCMFtmwwXdLiv+iaEfHd4FfuGick1TqAqpxtb/n63u/KSpVfQvHaZBt2wL1IvgmQEA5f74V2FtCJd8DEFdT0wR9tXUyxR+S3sQ0G8K01AUqi8u+fZdxnCXAhiLi3PmdEV/voaPXUlVVeIWfwTTn+F30ChG4S0xSqR5ghdr2H4DHgXxT1DBtbKxG5ISffU4oqIzCNPNb2zPAt0gmfyrBN0nvIvTxuCSTTyEyi+y/QhUQhg27AUNfC2vTE6qDuHjRAX6E40yVZPInUb48lKlVVm17DnA/sI/2ui0cOnYB996B4BD+DbJI3r/tlfKaLSPUskxJpTJ6qGU7yp1k/xgVxeIbIC8CHRxPvyTNqfKUyXohtgVL91u1DKq8CXVmIMY0lKmg1wODyf6XeBjCFZRu4L+gpxE5gSOvg76GafxO6rf+M6748vgfUuJ64k7YVBcAAAAASUVORK5CYII=";function I(){const{id:s}=h(),{character:a}=p(r.useMemo(()=>s,[s])),i=a&&a.transformations.length>0;return a?e.jsxs("div",{className:"character-details-container",children:[e.jsx("div",{className:"character-details-container__card-container_img-container",children:e.jsx("img",{className:"character-image",src:a.image,alt:a.name,"aria-label":"Character image",width:"15%"})}),e.jsx("div",{className:"character-details-container__card-container",children:e.jsxs("div",{children:[e.jsxs("div",{className:"character-details-container__card-container_heading",children:[e.jsxs("div",{children:[e.jsx("h2",{children:a.name}),e.jsxs("div",{className:"character-details-container__card-container_subtitle",children:[e.jsx("img",{className:"subtitle-image",src:j,alt:"Fire image","aria-label":"Fire image"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Ki (Power level):"})," ",a.ki]})]})]}),e.jsxs("div",{className:"stats-container",children:[e.jsx(l,{title:"People",value:a.gender,icon:m}),e.jsx(l,{title:"Origin",value:a.race,icon:x}),e.jsx(l,{title:"Affiliation",value:a.affiliation,icon:f})]})]}),e.jsx("br",{}),e.jsx("p",{children:a.description}),e.jsx("h4",{children:"Planet of Origin"}),e.jsxs("p",{children:[e.jsxs("span",{children:[e.jsx("strong",{children:"Name:"})," ",a.originPlanet.name]}),e.jsx("span",{children:" | "}),e.jsxs("span",{children:[e.jsx("strong",{children:"Destroyed:"})," ",a.originPlanet.isDestroyed?"Yes":"No"]})]}),e.jsx("p",{children:a.originPlanet.description}),i&&e.jsxs(g.Fragment,{children:[e.jsx("h4",{children:"Transformations"}),e.jsx("ul",{className:"transformations",children:a.transformations.map(n=>e.jsxs("li",{children:[e.jsxs("span",{children:["🔶 ",n.name]}),e.jsx("span",{children:" | "}),e.jsxs("span",{children:[e.jsx("strong",{children:"Ki:"})," ",n.ki]})]},n.id))})]})]})})]}):null}export{I as default};
