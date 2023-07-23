import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TopBar from '../TopBar';

const steps = [
  {
    label: '天氣',
    description:
      <Box sx={{ width: "100%", m: 0, p: 0 }}>
        <Card sx={{ mt: 0, pt: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <FmdGoodIcon />請允許定位
            </Typography>

            <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
            <Typography variant="body2">
              請允許我們使用定位，才能獲取你所在地點的天氣資料
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">開啟定位</Button>
          </CardActions></Card></Box>,
  },
  {
    label: 'Create an ad group',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

export default function HomePage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {

    if (activeStep === 0) {
      setActiveStep(maxSteps - 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  return (
    <>
      <TopBar title="首頁" />
      <Box sx={{ display: "flex", p: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Paper
            square
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 50,

              bgcolor: 'background.default',
              m: 2,
              ml: 0
            }}
          >
            <h2>{steps[activeStep].label}</h2>
          </Paper>
          <Box sx={{ height: "180px", width: '90%' }}>
            {steps[activeStep].description}
          </Box>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
              //disabled={activeStep === maxSteps - 1}
              >
                下一頁
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                上一頁
              </Button>
            }
          />
        </Box>
      </Box>
      
    </>
  );
}

