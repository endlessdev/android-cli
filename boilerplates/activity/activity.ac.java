package {%packageName%};

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class {%activityName%}Activity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_{%activityNameLowerCase%}});
    }
}
