<?php include('../header.php'); ?>
    <div class="ui stackable grid">
        <div class="four wide column">
            <form class="ui form js-form-generator">
                <div class="first-level">
                    <div class="field">
                        <label>Метод</label>
                        <select name="method" class="ui dropdown js-method">
                            <option value="POST" selected>POST</option>
                            <option value="GET">GET</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Урл для отправки</label>
                        <input type="text" name="action" class="js-action" placeholder="action">
                    </div>
                    <div class="field">
                        <button class="ui button js-create-form" type="button">Создать форму</button>
                    </div>
                </div>

                <div class="second-level">
                    <div class="field">
                        <input type="text" name="label" placeholder="label">
                    </div>
                    <div class="field">
                        <input type="text" name="name" placeholder="name">
                    </div>
                    <div class="field">
                        <label>Тип поля</label>
                        <select class="ui dropdown" name="type">
                            <option value="">Gender</option>
                            <option value="text">Male</option>
                            <option value="button">Female</option>
                        </select>
                    </div>
                    <div class="field">
                        <input type="text" name="placeholder" placeholder="placeholder">
                    </div>
                    <div class="field">
                        <div class="ui checkbox">
                            <input type="checkbox" name="required" tabindex="0" class="hidden">
                            <label>Обязательное поле</label>
                        </div>
                    </div>
                    <div class="field">
                        <input type="text" name="message" placeholder="message">
                    </div>
                    <div class="field">
                        <input type="text" name="additionalClass" placeholder="additionalClass">
                    </div>
                    <div class="field">
                        <button class="ui button js-create-field" type="button">Создать Поле</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="four wide column">
            <div class="js-simple-form"></div>
        </div>
        <div class="four wide column">
            <div class="js-answer"></div>
        </div>
    </div>
<?php include('../footer.php');
