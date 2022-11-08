export default function validateAccountData(username,password,email,firstname,lastname,isAdminAccount){
        if (username === "") {
            return ("You must provide a username.");
        }
        if (password === "") {
            return("You must provide a password.");
        }
        if (email === "") {
            return("You must provide an email address.");
        }
        if (!isAdminAccount) {

            if (firstname === "") {
                return("Please enter your first name.");
            }
            if (lastname === "") {
                return("Please enter your last name.");
            }
        }
        return "valid";
}