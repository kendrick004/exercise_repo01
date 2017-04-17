$(function(){
    var inputs = ['title','firstname','surname','street','town','postal','dob','is_adult'];
    var error_modal = jQuery.extend(true, {}, waitingDialog);
    $('input[name="is_adult"]').on('change blur',function(){
        var date = $('input[type="date"]').val();
        if(!validate.isAllowedAge(18,date)){
            error_modal.show('System Message...', {
                dialogSize: 'sm', 
                progressType: 'success',
                closable: true,
                content: `
                    <p>You are below the age requirement.</p>
                `
            });
            $(this).prop('checked',false);
        }
    });

    $('input[type="date"]').on('change blur',function(){
        var date = $(this).val();
        $('input[name="is_adult"]').prop('checked',validate.isAllowedAge(18,date));
    });

    $('#register').on('click',function(){
        var errors = [];
        $('#msg').hide();
        for(var i=0;i<inputs.length;i++){
            var name = inputs[i];
            var input = (name == 'title') ? $('select[name="' + name + '"]') : $('input[name="' + name + '"]');
            if(validate.isBlank(input.val()) && name != 'is_adult'){
                if(name == 'dob'){
                    errors.push({
                        name: 'Date of Birth',
                        msg: 'Date of birth is invalid. Please input proper value for Date of Birth .'
                    });
                }else{
                    errors.push({
                        name: name,
                        msg: name.capitalize() + ' is blank. Please input proper value for ' + name + '.'
                    });
                }
            }
        }
        if(!$('input[name="is_adult"]').is(':checked')){
            var msg = '';
            if(validate.isValidDate($('input[type="date"]').val())){
                msg = 'Please confirm that you are 18+ years old.';
            }else{
                msg = 'Please provide your date of birth.';
            }
            errors.push({
                name: 'Age Verification',
                msg: 'Age Verification is required. ' + msg
            });
        }

        if(errors.length > 0){
            var output = [];
            for(var i=0;i<errors.length;i++){
                output.push('<li class="list-group-item">' + errors[i].msg + '</li>');
            }
            error_modal.show('System Message', {
                progressType: 'alert',
                closable: true,
                content: `
                    <div class="panel panel-danger">
                        <div class="panel-heading">Total error/s: <b>${errors.length}</div>
                        <div class="panel-body">
                            <ul class="list-group">
                                ${output.join('')}
                            </ul>
                        </div>
                    </div>
                `
            });
        }else{
            waitingDialog.show('Please wait..', {
                dialogSize: 'sm', 
                progressType: 'warning',
                content: ``
            });

            setTimeout(function(){
                waitingDialog.hide();
                $('form')[0].reset();
                $('#msg').show();
            },3000);
        }
    });
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var validate = {
    isValidDate: function(date){
        var min = new Date('1900-01-01');
        var max = new Date();

        var d = new Date(date);
        if ( Object.prototype.toString.call(d) === "[object Date]" ) {
            // it is a date
            if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
                return false;
            }
            else {
                if(d.getFullYear() >= min.getFullYear() && d.getFullYear() <= max.getFullYear())
                    return true;
                else
                    return false;
            }
        }
        else {
            return false;
        }
    },
    isBlank: function(value){
        return $.trim(value).length > 0 ? false : true;
    },
    isLeapYear: function(year){
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    },
    isAllowedAge: function(age, date){
        if(validate.isValidDate(date)){
            if(validate.getAge(date) >= age){
                return true;
            }
        }
        return false;
    },
    getAge: function(date){
        var birthDate = new Date(date);
        var now = new Date();
        var age = 0;
        // days since the birthdate    
        var days = Math.floor((now.getTime() - birthDate.getTime())/1000/60/60/24);

        for(var i=birthDate.getFullYear();i<now.getFullYear();i++){
            var daysInYear = validate.isLeapYear(i) ? 366 : 365;
            if (days >= daysInYear){
                days -= daysInYear;
                age++;
                // increment the age only if there are available enough days for the year.
            }
        }
        return age;
    }
};