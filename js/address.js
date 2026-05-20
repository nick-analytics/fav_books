class Address{
    constructor(street1, street2, suburb, state, postcode){
        this.street1 = street1;
        this.street2 = street2;
        this.suburb = suburb;
        this.state = state;
        this.postcode = postcode;

    }

 //-- validate address methods --
 // -- Validates all fields that are required. 
    validateRequiredFields() {
        if (!this.street1 || this.street1.trim() === '') {
            return 'Street address cannot be empty';
        }
        if (!this.suburb || this.suburb.trim() === '') {
            return 'Suburb cannot be empty';
        }
        if (!this.state) {
            return 'State cannot be empty';
        }
        if (!this.postcode || this.postcode.trim() === '') {
            return 'Postcode cannot be empty';
        }
        return null;
    }

// Check required fields do not contain special chars 
    validateFormat(){
        const streetPattern = /^[a-zA-Z0-9\s\/\-]+$/;
        const suburbPattern = /^[a-zA-Z\s\-']{2,35}$/;
        const postcodePattern = /^[0-9]{4}$/;
        
        if (!streetPattern.test(this.street1)){
            return 'Street address contains invalid characters';
        }
        if (!suburbPattern.test(this.suburb)){
            return 'Suburb contains invalid characters';
        }
        if (!postcodePattern.test(this.postcode)){
            return 'Postcode contains invalid characters';
        }
        return null;
    }
    

//  -- Validate if postal code matches state.

    validateStatePostcodeMatch() {
        const postcodeCheck = Number(this.postcode);
        const stateCheck = this.state;
        let isValid = false;

        switch (stateCheck) {
            case "ACT":
                isValid = ((postcodeCheck >= 200 && postcodeCheck <=299) ||
                          (postcodeCheck >= 2600 && postcodeCheck <= 2618) ||
                          (postcodeCheck >=2900 && postcodeCheck <= 2920));
                break;
            case "NSW":
                isValid = ((postcodeCheck >= 1000 && postcodeCheck <=1999)
                          || (postcodeCheck >= 2000 && postcodeCheck <= 2599)
                          || (postcodeCheck >=2619 && postcodeCheck <= 2899));
                break;
            case "VIC":
                isValid = ((postcodeCheck >= 3000 && postcodeCheck <= 3999) ||
                          (postcodeCheck >= 8000 && postcodeCheck <= 8999));
                break;
            case "QLD":
                isValid = ((postcodeCheck >= 4000 && postcodeCheck <= 4999) ||
                          (postcodeCheck >= 9000 && postcodeCheck <= 9999));
                break;
            case "SA":
                isValid = ((postcodeCheck >= 5000 && postcodeCheck <= 5999)); 
                break;
            case "WA":
                isValid = ((postcodeCheck >= 6000 && postcodeCheck <= 6797) ||
                          (postcodeCheck >= 6800 && postcodeCheck <= 6999));
                break;
            case "TAS":
                isValid = ((postcodeCheck >= 7000 && postcodeCheck <= 7799) ||
                          (postcodeCheck >= 7800 && postcodeCheck <= 7999));
                break;
            case "NT":
                isValid = ((postcodeCheck >= 800 && postcodeCheck <= 899) ||
                          (postcodeCheck >= 900 && postcodeCheck <= 999));
                break;
        }

        if (!isValid) {
            return 'Postcode does not match state';
        }
        return null;

    }
// --Format address to a readable string --

    formatAddress(){
        const formattedAddress = `${this.street1} ${this.street2}, ${this.suburb} ${this.state} ${this.postcode}.`;
        return  formattedAddress
    }
}