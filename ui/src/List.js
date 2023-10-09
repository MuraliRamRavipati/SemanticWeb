import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

const getData = async (endPoint) => {
  return fetch(`http://127.0.0.1:5000/${endPoint}`)
    .then((response) => response.json())
    .then((data) => data);
}

const getHeader = (type, params) => {
  if (type === 'nation-winners') {
    return `Winners from nation ${params.nation}`;
  } else if (type === 'category-winners') {
    return `Winners from category ${params.category}`;
  } else if (type === 'year-winners') {
    return `Winners from year ${params.year}`;
  } else if (type === 'year-category-winners') {
    return `Winners from year ${params.year} and category ${params.category}`;
  }
}

const List = (props) => {

  const { type } = props;
  const params = useParams();
  const [nations, setNations] = React.useState([]);
  React.useEffect(() => {

    let url = '';

    if (type === 'nation-winners') {
      url = `nobel/nations/${params.nation}`;
    } else if (type === 'category-winners') {
      url = `nobel/categories/${params.category}`;
    } else if (type === 'year-winners') {
      url = `nobel/${params.year}`;
    } else if (type === 'year-category-winners') {
      url = `nobel/${params.year}/${params.category}`;
    }

    getData(url).then((values) => {
      setNations(values.data);
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
      <h2>{getHeader(type, params)}</h2>
      <ul>
        {nations.map((nation) => (
          // <li key={nation}>{nation}</li>
          <li key={nation}><Link to={`/details/${nation}`}>{nation}</Link></li>
        ))}
      </ul>
      <Button variant="contained" onClick={routeChange}>Home</Button>
    </div>
  );
}

export default List;
