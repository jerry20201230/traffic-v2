import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function LinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const [radio1Value, setRadio1Value] = React.useState('navLoc');
    const [radio2Value, setRadio2Value] = React.useState('fromMap');


    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const steps = ['設定起點', '設定終點'];
    var stepBody = [
        <>
            <FormControl>
                <RadioGroup
                    row
                    name="row-radio-buttons-group-1"
                    value={radio1Value}
                    onChange={(e) => setRadio1Value(e.target.value)}
                >
                    <FormControlLabel value="navLoc" control={<Radio />} label="使用定位" />
                    <FormControlLabel value="fromMap" control={<Radio />} label="從地圖選擇" />
                    <FormControlLabel value="typeIn" control={<Radio />} label="輸入地址" />
                </RadioGroup>
            </FormControl>
        </>,
        <>
            <FormControl>
                <RadioGroup
                    row
                    name="row-radio-buttons-group-2"
                    value={radio2Value}
                    onChange={(e) => setRadio2Value(e.target.value)}
                >
                    <FormControlLabel value="fromMap" control={<Radio />} label="從地圖選擇" />
                    <FormControlLabel value="typeIn" control={<Radio />} label="輸入地址" />
                </RadioGroup>
            </FormControl>
        </>]






    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <Typography sx={{ mt: 2, mb: 1, p: 1, textAlign: "center" }} component="div"><CircularProgress /><br />正在規劃路線<p><Button variant='contained' color="secondary" onClick={() => window.location.reload()}>重試</Button></p></Typography>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1, p: 1 }} component="div" >
                        {stepBody[activeStep]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            上一步
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? '開始規劃路線' : '下一步'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}