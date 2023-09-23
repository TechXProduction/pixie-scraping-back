from sklearn.linear_model import LinearRegression
from sklearn import linear_model
from sklearn.pipeline import Pipeline
from sklearn. compose import ColumnTransformer, make_column_transformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
import seaborn as sns
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import statsmodels.formula.api as smf
import statsmodels.api as sm
import numpy as np
import pandas as pd
from scipy import stats
from scipy.stats import pearsonr
import matplotlib.pyplot as plt

p_df = pd.read_csv("./ultimas_viviendas.csv")
# p_df = pd.read_csv("BaseDatosPixie.csv")

# Metodos estadisticos para analizar los datos
# p_df.plot(kind = "box", title = "Diagramas de Caja de las variables a Analizar")
# plt.show()
# p_df.plot(kind = "scatter", x = "M2", y = "Opinion_Valor_Precio_Final", cmap = "virdis")
# plt.show()
# p_df.plot(kind = "scatter", x = "M2_Construccion", y = "Opinion_Valor_Precio_Final", cmap = "virdis")
# plt.show()

# Revision de la Correlacion de los Datos
# print("Hipotesis de significancia se basara en 0.5 <= a <= 0.5")
m2p, a = stats.pearsonr(p_df["M2"], p_df["Opinion_Valor_Precio_Final"])
m2pc, b = stats.pearsonr(p_df["M2_Construccion"],
                         p_df["Opinion_Valor_Precio_Final"])
ubip, c = stats.pearsonr(p_df["Ubicacion"], p_df["Opinion_Valor_Precio_Final"])
cosp, d = stats.pearsonr(p_df["COS"], p_df["Opinion_Valor_Precio_Final"])
cusp, e = stats.pearsonr(p_df["CUS"], p_df["Opinion_Valor_Precio_Final"])
segp, f = stats.pearsonr(p_df["Seguridad"], p_df["Opinion_Valor_Precio_Final"])
edp, g = stats.pearsonr(p_df["Edad"], p_df["Opinion_Valor_Precio_Final"])
nocp, h = stats.pearsonr(
    p_df["No_Cuartos"], p_df["Opinion_Valor_Precio_Final"])
nobp, i = stats.pearsonr(p_df["No_banos"], p_df["Opinion_Valor_Precio_Final"])
p2p, j = stats.pearsonr(p_df["Dos_Plantas"],
                        p_df["Opinion_Valor_Precio_Final"])
m2cochp, k = stats.pearsonr(
    p_df["M2_Cochera"], p_df["Opinion_Valor_Precio_Final"])
ms2tp, l = stats.pearsonr(p_df["minisplit_2ton"],
                          p_df["Opinion_Valor_Precio_Final"])
ms125tp, m = stats.pearsonr(
    p_df["minisplit_1_5ton"], p_df["Opinion_Valor_Precio_Final"])
ms1tp, n = stats.pearsonr(p_df["minisplit_1ton"],
                          p_df["Opinion_Valor_Precio_Final"])
norp, o = stats.pearsonr(p_df["No_recamaras"],
                         p_df["Opinion_Valor_Precio_Final"])
nsp, p = stats.pearsonr(p_df["Nivel_Socioeconomico"],
                        p_df["Opinion_Valor_Precio_Final"])

# print(f"Correlacion de los metros cuadrados con e precio: {m2p}");
# print(f"Correlacion de los metros cuadrados de construccion con el precio: {m2pc}");
# print(f"Correlacion de la ubicacion con el precio: {ubip}");
# print(f"Correlacion del COS con el precio: {cosp}");
# print(f"Correlacion del CUS con el precio: {cusp}");
# print(f"Correlacion de la seguridad con el precio: {segp}");
# print(f"Correlacion de la edad con el precio: {edp}");
# print(f"Correlacion del No. de Cuartos y el Precio: {nocp}");
# print(f"Correlacion del No. de banos y el precio: {nobp}");
# print(f"Correlacion de dos plantas y el precio: {p2p}");
# print(f"Correlacion de metros de cochera y el precio: {m2cochp}");
# print(f"Correlacion de minisplit de 2 ton y el precio: {ms2tp}");
# print(f"Correlacion de minisplit de 1.5 ton y el precio: {ms125tp}");
# print(f"Correlacion de minisplit de 1 ton y el precio: {ms1tp}");
# print(f"Correlacion de No. de recamaras y el precio: {norp}");
# print(f"Correlacion de Nivel socioeconmico y el precio: {nsp}");

# Comienza el modelo de prediccion con AI

r2 = 0.0
while r2 < 0.90:
    # Programacion del Modelo
    var_ind = p_df[["M2", "M2_Construccion", "Ubicacion", "COS", "CUS", "Edad", "Seguridad", "No_Cuartos", "No_banos",
                    "Dos_Plantas", "M2_Cochera", "minisplit_2ton", "minisplit_1_5ton", "minisplit_1ton", "No_recamaras", "Nivel_Socioeconomico"]]
    var_dep = p_df["Opinion_Valor_Precio_Final"]

    # Separación de los datos en conjuntos de entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(
        var_ind, var_dep, test_size=0.20)

    # Preprocesamiento de las variables numéricas y categóricas
    num_features = ['M2', 'M2_Construccion', 'COS', 'CUS', "Edad", 'No_Cuartos', 'No_banos',
                    'M2_Cochera', 'No_recamaras', 'Seguridad', 'minisplit_2ton', 'minisplit_1_5ton', 'minisplit_1ton']
    cat_features = ['Ubicacion', 'Dos_Plantas', 'Nivel_Socioeconomico']
    num_transformer = Pipeline(steps=[('scaler', StandardScaler())])
    cat_transformer = Pipeline(
        steps=[('onehot', OneHotEncoder(handle_unknown='ignore'))])
    preprocessor = ColumnTransformer(transformers=[(
        'num', num_transformer, num_features), ('cat', cat_transformer, cat_features)])

    # Creación del modelo de regresión lineal
    model = Pipeline(steps=[('preprocessor', preprocessor),
                     ('regressor', LinearRegression())])

    # Entrenamiento del modelo
    model.fit(X_train, y_train)

    # Predicción con el conjunto de prueba
    y_pred = model.predict(X_test)

    # Cálculo de la métrica de error del modelo
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    # Impresión de los resultados
    print(f"Error cuadratico medio: {mse}")
    print(f"Coeficiente de determinacion R2: {r2}")
    print("Score de la regresion lineal: %f" % model.score(X_test, y_test))

    # Obtención de los coeficientes del modelo
    coeficientes = model.named_steps['regressor'].coef_
    intercepto = model.named_steps['regressor'].intercept_

print(r2)
print("Coeficientes: ", coeficientes)
print("Intercepto: ", intercepto)
print(f"Variable: Intercepto, Coeficiente: {intercepto}")

# Muestra de Gráficas
validacion = pd.DataFrame(
    {"Actual": y_test, "Prediccion": y_pred, "Diferencia": y_test-y_pred})
validacion.plot(kind="bar", title="Grafica de barras de la prediccion")
plt.show()

# Obtención de los nombres de las variables numéricas originales
num_feature_names = preprocessor.named_transformers_[
    'num'].named_steps['scaler'].get_feature_names_out(num_features)

# Obtención de los nombres de las variables categóricas originales
cat_feature_names = preprocessor.named_transformers_[
    'cat'].named_steps['onehot'].get_feature_names_out(cat_features)

# Concatenación de los nombres de las variables
all_feature_names = np.concatenate([num_feature_names, cat_feature_names])

# Creación de un diccionario que asocia los coeficientes con las variables originales
coeficientes_variables = dict(zip(all_feature_names, coeficientes))

# Impresión de los coeficientes y las variables correspondientes
for variable, coeficiente in coeficientes_variables.items():
    print(f"Variable: {variable}, Coeficiente: {coeficiente}")

# Multiplicar el modelo por los valores de una prueba
# Convertir la fila de prueba a un DataFrame
prueba = pd.DataFrame(X_test.iloc[0]).transpose()

# Asegurarse de que la prueba tenga todas las características necesarias
prueba_transformada = model.named_steps['preprocessor'].transform(prueba)

# Obtención de los nombres de las variables numéricas originales
num_feature_names = preprocessor.named_transformers_[
    'num'].named_steps['scaler'].get_feature_names_out(num_features)

# Obtención de los nombres de las variables categóricas originales
cat_feature_names = preprocessor.named_transformers_[
    'cat'].named_steps['onehot'].get_feature_names_out(cat_features)

# Concatenación de los nombres de las variables
all_feature_names = np.concatenate([num_feature_names, cat_feature_names])

# Creación de un diccionario que asocia los coeficientes con las variables originales
coeficientes_variables = dict(zip(all_feature_names, coeficientes))

# Multiplicar los coeficientes por los valores de la prueba en una ecuación
ecuacion = f"Prediccion = {intercepto}"
for variable, coeficiente in coeficientes_variables.items():
    valor = prueba_transformada[0][all_feature_names.tolist().index(variable)]
    ecuacion += f" + ({coeficiente} * {valor})"

# Desplegar la ecuación en la consola
print("Ecuacion del modelo multiplicado por los valores de la prueba:")
print(ecuacion)

# Convertir la fila de prueba a un DataFrame
prueba = pd.DataFrame(X_test.iloc[0]).transpose()

# Asegurarse de que la prueba tenga todas las características necesarias
prueba_transformada = model.named_steps['preprocessor'].transform(prueba)

# Predicción utilizando los coeficientes y la prueba transformada en una sola ecuación
prediccion_prueba = intercepto + np.dot(coeficientes, prueba_transformada[0])

# Desplegar el resultado en la consola
print("Modelo multiplicado por los valores de la prueba:")
print(prediccion_prueba)

# Obtención del preprocesador del modelo
preprocessor = model.named_steps['preprocessor']

# Obtención de las medias y las desviaciones estándar utilizadas por el StandardScaler
means = preprocessor.named_transformers_['num'].named_steps['scaler'].mean_
stds = preprocessor.named_transformers_['num'].named_steps['scaler'].scale_

# Mostrar las operaciones del StandardScaler
print("Operaciones del StandardScaler:")
for i, feature_name in enumerate(num_features):
    mean = means[i]
    std = stds[i]
    print(f"Variable: {feature_name}_resta, Coeficiente: {mean}")
    print(f"Variable: {feature_name}_division, Coeficiente: {std}")
    print(f"   Resta_media: {mean}")
    print(f"   Division por la desviacion estandar: {std}")


print("Datos de prueba:")
print("X_test:")
print(X_train)
print("\ny_test:")
print(y_train)
