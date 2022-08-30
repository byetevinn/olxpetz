import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --color-primary: #00DEDF;
    --color-secundary:  #CE8EDB;
    --gray-4: #292929;
    --gray-3:  rgba(119, 159, 156, 0.2);;
    --gray-0:#f8f9fa;


    --color-success: #3fe864;
    --color-warning: #Ffcd07;
    --color-error: #e83f5b;
    --color-information: #155bcb;
    --color-primary-Disable:#59323F;
    --font-family: 'KoHo', sans-serif;

   
  }

*{
    margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
}
body{
 overflow-x: hidden;
 background-color: #121214;
}
body::-webkit-scrollbar {
    border: none;
    width: 8px;
}
  body::-webkit-scrollbar-thumb {
    background-color: var(--gray-3);
    border-radius: 5px;
}
button{
  cursor: pointer;
}
a{
  cursor: pointer;
}
ul,li{
 list-style: none;
 
}
`;