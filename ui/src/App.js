import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Button } from '@mui/material';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const getData = async (endPoint) => {
  return fetch(`http://127.0.0.1:5000/${endPoint}`)
    .then((response) => response.json())
    .then((data) => data);
}

const NationsTab = (props) => {
  const [nations, setNations] = React.useState([]);
  React.useEffect(() => {

    getData('nobel/nations').then((values) => {
      setNations(values.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [getData])

  return (
    <div>
      <h2>Nations</h2>
      <ul>
        {nations.map((nation) => (
          <li key={nation}><Link to={`/nations/${nation}`}>{nation}</Link></li>
        ))}
      </ul>
    </div>
  );
}

const CategoriesTab = (props) => {
  const [nations, setNations] = React.useState([]);
  const { setCategories } = props;
  React.useEffect(() => {

    getData('nobel/categories').then((values) => {
      setNations(values.data);
      setCategories(values.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [getData])

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {nations.map((nation) => (
          <li key={nation}><Link to={`/categories/${nation}`}>{nation}</Link></li>
        ))}
      </ul>
    </div>
  );
}

const YearsTab = (props) => {
  const [nations, setNations] = React.useState([]);
  const { setYears } = props;
  React.useEffect(() => {

    getData('nobel/years').then((values) => {
      setNations(values.data);
      setYears(values.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [getData])

  return (
    <div>
      <h2>Years</h2>
      <ul>
        {nations.map((nation) => (
          <li key={nation}><Link to={`/years/${nation}`}>{nation}</Link></li>
        ))}
      </ul>
    </div>
  );
}


function YearCategoryTab(props) {

  const [firstValue, setYear] = React.useState("");
  const [secondValue, setCategory] = React.useState("");
  const [empty, setEmpty] = React.useState(false);

  const [years, setYears] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [winners, setWinners] = React.useState([]);

  const handleClick = () => {
    setEmpty(false)
    getData(`nobel/${firstValue}/${secondValue}`).then((values) => {
      setWinners(values.data)
      if (values.data.length === 0) { setEmpty(true) }
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleClear = () => {
    setYear("");
    setCategory("");
    setWinners([]);
    setEmpty(false);
  }

  const handleFirstChange = (event) => {
    setYear(event.target.value);
  };

  const handleSecondChange = (event) => {
    setCategory(event.target.value);
  };

  React.useEffect(() => {

    getData('nobel/years').then((values) => {

      setYears(values.data);
      console.log(years);
      getData('nobel/categories').then((values) => {

        setCategories(values.data);

      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log(error);
    })
  }, [getData])


  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="first-select-label">Select Year</InputLabel>
        <Select
          value={firstValue}
          onChange={handleFirstChange}
        >
          {
            years.map((year) => (
              <MenuItem value={year}>{year}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="second-select-label">Select Category</InputLabel>
        <Select
          labelId="second-select-label"
          id="second-select"
          value={secondValue}
          onChange={handleSecondChange}
        >
          {
            categories.map((category) => (
              <MenuItem value={category}>{category}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <br />
      <br />
      <Button variant="contained" onClick={handleClick} disabled={!(firstValue && secondValue)}>Submit</Button>
      <Button onClick={handleClear}>Clear</Button>
      {
        winners.length > 0 && (
          <div>
            <h2>{`Winners for year ${firstValue} and category ${secondValue}`}</h2>
            <ul>
              {winners.map((nation) => (
                // <li key={nation}>{nation}</li>
                <li key={nation}><Link to={`/details/${nation}`}>{nation}</Link></li>
              ))}
            </ul>
          </div>
        )
      }
      {
        empty && <h2>No Winners for selection</h2>
      }
    </div>
  );
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function App() {
  const [value, setValue] = React.useState(0);

  const [years, setYears] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="App">
      <h1>Nobel Prize Winners</h1>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Nation" {...a11yProps(0)} />
            <Tab label="Category" {...a11yProps(1)} />
            <Tab label="Year" {...a11yProps(2)} />
            <Tab label="Year and Category" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <NationsTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CategoriesTab setCategories={setCategories} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <YearsTab setYears={setYears} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <YearCategoryTab years={years} categories={categories} />
        </TabPanel>
      </Box>
    </div>
  );
}

export default App;
