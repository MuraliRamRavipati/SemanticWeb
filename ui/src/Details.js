import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

const getData = async (endPoint) => {
  return fetch(`http://127.0.0.1:5000/${endPoint}`)
    .then((response) => response.json())
    .then((data) => data);
}

const Details = () => {

  const params = useParams();
  const [nations, setNations] = React.useState([]);
  React.useEffect(() => {

    let url = `details/${params.user}`;

    getData(url).then((values) => {
      setNations(values.data);
      console.log(values.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [getData])

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  return (
    <div>
      <h2>Winner Details</h2>
      <ul>
        <li>Name : {nations.name}</li>
        <li>Birth Year : {nations.birthYear}</li>
        <li>Death Year : {nations.deathYear}</li>
        <li>Nationality : {nations.nationality}</li>
        <li>Photo : {nations.photo}</li>
        <li>Category : {nations.category}</li>
        <li>Association : {nations.association}</li>
        <li>Motivation : {nations.motivation}</li>
        <li>Nobel Year : {nations.nobelYear}</li>
      </ul>
      <Button variant="contained" onClick={routeChange}>Home</Button>
    </div>
  );
}

export default Details;
